class ApplicationController < ActionController::API
  before_action :authenticate_user_from_token!

  private

  def authenticate_user_from_token!
    auth_token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless auth_token

    user = User.find_by(authentication_token: auth_token)
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless user

    @current_user = user
  end

  def current_user
    @current_user
  end
end
