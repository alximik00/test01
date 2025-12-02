require 'net/http'
require 'uri'
require 'json'

BOOM_AUTH_URL = 'https://app.boomnow.com/open_api/v1/auth/token'.freeze
BOOM_LISTINGS_URL = 'https://app.boomnow.com/open_api/v1/listings'.freeze

class Api::V1::ListingsController < ApplicationController
  # Listings search is public, secured via BOOM client credentials

  def index
    city      = params[:city]
    check_in  = params[:check_in]
    check_out = params[:check_out]
    page      = params[:page]

    unless city.present? && check_in.present? && check_out.present?
      return render json: { error: 'city, check_in and check_out are required' }, status: :bad_request
    end

    begin
      response = fetch_listings_from_boom(city:, check_in:, check_out:, page:)

      render json: response[:body], status: response[:status]
    rescue => e
      Rails.logger.error("[BoomListings] Error: #{e.class} - #{e.message}")
      render json: { error: 'Failed to fetch listings from provider' }, status: :bad_gateway
    end
  end

  private

  def fetch_listings_from_boom(city:, check_in:, check_out:, page:)
    token = fetch_boom_token

    # According to the Boom Booking API "Returns all listings" endpoint docs:
    # https://boomnow.stoplight.io/docs/boom-booking-api/e9k2w4m3hoj3i-returns-all-listings
    # this request retrieves listings and can be filtered by location and dates.
    # We call the production API host using the token obtained from the auth endpoint.
    uri = URI.parse(BOOM_LISTINGS_URL)

    query = {
      city: city,
      check_in: check_in,
      check_out: check_out,
      page: page
    }.compact

    uri.query = URI.encode_www_form(query)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'

    request = Net::HTTP::Get.new(uri.request_uri)
    request['Accept'] = 'application/json'
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{token}"

    response = http.request(request)

    {
      status: response.code.to_i,
      body: JSON.parse(response.body)
    }
  end

  def fetch_boom_token
    client_id     = ENV['BOOM_CLIENT_ID']
    client_secret = ENV['BOOM_CLIENT_SECRET']

    raise 'BOOM_CLIENT_ID not configured' unless client_id.present?
    raise 'BOOM_CLIENT_SECRET not configured' unless client_secret.present?

    uri = URI.parse(BOOM_AUTH_URL)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'

    request = Net::HTTP::Post.new(uri.request_uri)
    request['Accept'] = 'application/json'
    request['Content-Type'] = 'application/json'
    request.body = {
      client_id: client_id,
      client_secret: client_secret
    }.to_json

    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      raise "Boom auth failed with status #{response.code}"
    end

    body = JSON.parse(response.body)
    body['access_token'] || body['token'] || raise('Boom auth token missing in response')
  end
end


