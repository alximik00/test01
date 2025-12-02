class Api::V1::CitiesController < ApplicationController
  # City autocomplete is public

  def index
    query = params[:q].to_s.strip

    return render json: [] if query.blank?

    cities = City
      .where('name LIKE ?', "#{sanitize_query(query)}%")
      .order(:name)
      .limit(10)

    render json: cities.select(:id, :name)
  end

  private

  def sanitize_query(q)
    # Simple sanitization to avoid wildcards injection
    q.gsub(/[%_]/, '')
  end
end


