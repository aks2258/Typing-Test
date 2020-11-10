class UsersController < ApplicationController

    def index
        render :json => User.all
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @user=User.new(user_params)
        if @user.valid?
            @user.save
            # session[:user_id] = @user.id
            # redirect_to root_path
            render json: @user
        else
            @error=@user.errors.full_messages
            # render :new
        end
    end

    def update
      user = User.find(params[:id])
      user.update(wpm: params[:wpm], accuracy: params[:accuracy])
    end

    def destroy
        @user = User.find(params[:id]).destroy
        render json: @user
    end

    private

    def user_params
      params.require(:user).permit(:username, :password, :wpm, :accuracy)
    end
end
