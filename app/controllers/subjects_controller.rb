class SubjectsController < ApplicationController
    
    def subject_list
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
            @view_content = Content.where(subject_id: params[:subject_id])
        
        @one_subject = @subjects.find(params[:subject_id])
        
    end
    
    def subject_add_new
        
        @subject = Subject.create(sub_name: params[:sub_name], dday: params[:dday])
        @subject.save
        
        # 중간 테이블 저장
        @studies = Study.new
        @studies.user_id = current_user.id
        @studies.subject_id = @subject.id
        @studies.all_count = 0
        @studies.xcount = 0
        @studies.save

        redirect_to '/'
    end
    
    def subject_delete
        subject = Subject.find(params[:s_id])
        subject.destroy
        redirect_to '/'
    end
    
    def update
        @subject = Subject.find(params[:subject_id])
        @subject.sub_name = params[:sub_name]
        @subject.dday = params[:date]
        
        @subject.save
        
        redirect_to '/'
        
    end 

    
end
