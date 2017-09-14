class FailQuestionController < ApplicationController
    def show
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
        
        @subject_id = params[:subject_id]
        @fail = FailQuestion.find_by subject_id: @subject_id

    end
    
    def add
        @user_id = params[:user_id]
        @subject_id = params[:subject_id]
        @short_f_content = params[:short_f_content]
        @long_f_content = params[:long_f_content]
        
        # 이미 저장된 failquestion이 없다면 new 해서 저장
        if (FailQuestion.find_by subject_id: @subject_id).nil?
            @f_q_content = FailQuestion.new
            @f_q_content.user_id = @user_id
            @f_q_content.subject_id = @subject_id
            if @long_f_content.nil?
                @f_q_content.f_q_content = @short_f_content.clone();
            else
                @f_q_content.f_q_content = @long_f_content.clone();
            end
            
        # fail_question이 있으면 다시 저장
        else
            @f_q_content = FailQuestion.find_by subject_id: @subject_id
            @f_q_content.user_id = @user_id
            @f_q_content.subject_id = @subject_id

            if @long_f_content.nil?
                 @f_q_content.f_q_content.insert(0, "#{@short_f_content},");
            else
                 @f_q_content.f_q_content.insert(0, "#{@long_f_content},");
            end
        end
        
        @f_q_content.save

        redirect_to '/'

    end
end