class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user_from_token!, only: [:create]

  def create
    user = User.find_by(email: params[:email])
    
    if user && user.valid_password?(params[:password])
      user.ensure_authentication_token
      render json: {
        user: {
          id: user.id,
          email: user.email,
          authentication_token: user.authentication_token
        }
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def destroy
    current_user.update(authentication_token: nil)
    render json: { message: 'Logged out successfully' }, status: :ok
  end
end
