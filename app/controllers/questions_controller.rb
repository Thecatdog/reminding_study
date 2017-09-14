class QuestionsController < ApplicationController
    
    def solv_question
        # long_q
        if (current_user.email == "admin@email.com")
          @subjects = Subject.all
        else
          @subjects = Subject.where(id: Study.where(user_id: current_user).ids).all
        end
        
        @len3 = params[:len]
        @split = @len3.split(',').map(&:to_i)
    
        @content = []
        @lcontent = []
        (0..(@split.length-1)).each do |x|
            @con = @split[x]
            # @content[x] = Content.find(@con).all_content
            @lcontent[x] = Content.find(@con)
        end
        
        # short_q
        @subject_id = params[:subject_id]
        @len4 = params[:len]
        @split = @len4.split(",").map(&:to_i)
        
        #모든 array number를 돌리도록 수정
        @content = []
        (0..(@split.length-1)).each do |x|
            @con = @split[x]
            @content[x] = Content.find(@con)
        end
        #본래의 content를 수정하지 않는지 확인
        @answer = params[:answer]
        @content_title = (Content.find_by subject_id: @subject_id).title
        
    end
    
    def choice
        
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
        
        @contents_num = params[:len]
        @subject_id = params[:subject_id]
        @split = @contents_num.split(',').map(&:to_i)
    end
    
    def longQ
        if (current_user.email == "admin@email.com")
          @subjects = Subject.all
        else
          @subjects = Subject.where(id: Study.where(user_id: current_user).ids).all
        end
        
        @len3 = params[:len]
        @split = @len3.split(',').map(&:to_i)
    
        @content = []
        @lcontent = []
        (0..(@split.length-1)).each do |x|
            @con = @split[x]
            @lcontent[x] = Content.find(@con)
        end
    end
    
    def choice
        
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
        
        @contents_num = params[:len]
        @subject_id = params[:subject_id]
        @split = @contents_num.split(',').map(&:to_i)
    end
    
    def longQ
        if (current_user.email == "admin@email.com")
          @subjects = Subject.all
        else
          @subjects = Subject.where(id: Study.where(user_id: current_user).ids).all
        end
        
        @len3 = params[:len2]
        @split = @len3.split(',').map(&:to_i)
    
        @content = []
        @lcontent = []
        (0..(@split.length-1)).each do |x|
            @con = @split[x]
            @lcontent[x] = Content.find(@con)
        end
        
        # @con = @split[0]
        # @content = []
        # @content = Content.find(@con)
        # @lcontent = @content.all_content
        # @title = @content.title
        
        # @lcontent_q = @content.long_content_q
        # @lcontent_a = @content.long_content_a

    end
    def shortQ
        # @subjects = Subject.all
        
        if (current_user.email == "admin@email.com")
          @subjects = Subject.all
        else
          @subjects = Subject.where(id: Study.where(user_id: current_user).ids).all
        end
        
        @subject_id = params[:subject_id]
        @len4 = params[:len2]
        @split = @len4.split(",").map(&:to_i)
        
        #모든 array number를 돌리도록 수정
        @content = []
        (0..(@split.length-1)).each do |x|
            @con = @split[x]
            @content[x] = Content.find(@con)
            
        end
        #본래의 content를 수정하지 않는지 확인
        @answer = params[:answer]
    end
    
    def wrongQ
        # @subjects = Subject.all
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
        
        @subject_id = params[:subject_id] 
        @fail_questions = Fail_question.all
    end
    
    def long_fail_q
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subject = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").first
        end
        
        redirect_to '/subjects/subject_list/' + @subject.subject_id.to_s
    end
    
    def short_fail_q
    
        redirect_to '/subjects/subject_list/' + @subject.subject_id.to_s
    end
end
