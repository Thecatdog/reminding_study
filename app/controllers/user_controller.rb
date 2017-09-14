class UserController < ApplicationController
    before_filter :authenticate_user!, :except =>[:index]
    
    def new_user_registration
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
        
        user = User.create(name: params[:name])
        user.save
        redirect_to '/users/edit'
    end
    
    def edit
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
    end
    
    def update
        @user = User.find(params[:user_id])
        @user.name = params[:name]
        @user.email = params[:email]
        @user.school = params[:school]
        @user.major = params[:major]
        @user.save
        redirect_to '/'
    end
    
    def home
        
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
         @content_count = @subjects.count

    end
    
    def info
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
    end
end
