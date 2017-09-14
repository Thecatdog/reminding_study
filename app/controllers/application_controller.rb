class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name,:school,:major])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name,:school,:major])
  end
  
  def application
    
    @study = Study.find(user_id: current_user.id).all
    
    if(current_user.email == "admin@email.com")
      @subjects = Subject.all
    else
      @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
    end

  end
end
