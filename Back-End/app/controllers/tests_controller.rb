class TestsController < ApplicationController

  def index
    render :json => Test.all
  end

end
