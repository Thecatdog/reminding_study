class ContentsController < ApplicationController
    
    def new 
        @subject = Subject.find(params[:subject_id])
        
        if(current_user.email == "admin@email.com")
            @subjects = Subject.all
        else
            @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
        end
    end
    
    # 새로운 복습 내용을 저장
    def create
        @content = Content.new 
        @content.user_id = current_user.id
        @content.subject_id = params[:subject_id]
        @content.title = params[:title]
        @content.all_content = params[:all_content]
        
        if (current_user.email == "admin@email.com")
          @subjects = Subject.all
        else
          @subjects = Subject.where(id: Study.where(user_id: current_user).ids).all
        end
        
        # 소스코드로부터 tag 뽑기
        # short_content
        html_doc = Nokogiri::HTML(@content.all_content)
        
        if html_doc.css("strong").text.nil?
        else 
            (0..(html_doc.css("p").length-1)).each do|j|
                html_doc_p = html_doc.css("p")[j]
                html_doc_p_text = html_doc_p.text
                html_doc_strg = html_doc_p.css("strong")
                html_doc_rslt = html_doc_p_text
                
                @content.short_content[j] = []
                
                (0..(html_doc_strg.length-1)).each do |i|
                    html_doc_rslt = html_doc_p_text.gsub!(html_doc_strg[i].text, '_______')
                    html_doc_p_text = html_doc_rslt
                    @content.short_content[j] << html_doc.css("p")[j].css("strong")[i].text
                
                    # all count 계산
                    @one_study = Study.joins("INNER JOIN subjects ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").first
                    @one_study.all_count = @one_study.all_count + 1
                    @one_study.save
                end
            end
        end
        
        # long content 
        if html_doc.at("span").nil?
        else
            if html_doc.at('span').get_attribute('style').include?("underline")
                hash = Hash.new
            
                (0..(html_doc.css('span').length-2)).each do |i|
                    if i%2 == 0
                        hash[html_doc.css('span')[i].text] = html_doc.css('span')[i+1].text
                    end
 
                end
                
                # hash를 배열로 저장 
                
                (0..(hash.keys.length-1)).each do |i|
                   @content.long_content_q << hash.keys[i]
                   @content.long_content_a << hash.values[i]
                    
                    # all count 계산
                    @one_study = Study.joins("INNER JOIN subjects ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").first
                    @one_study.all_count = @one_study.all_count + 1
                    @one_study.save
                   
                end
            end
            
        end

        @content.save
        
        # 중간 테이블 저장
        @studies = Study.new
        @studies.user_id = @content.user_id
        @studies.subject_id = @content.subject_id
        @studies.all_count = 0
        @studies.xcount = 0
        @studies.save
        
        redirect_to '/contents/detail/' + @content.id.to_s
    end
    
    def detail
        @content = Content.find(params[:content_id])
        @subjects = Subject.all
        @one_subject = Subject.find(@content.subject_id)
    end
    
    # 수정하는 페이지로 이동
    def edit
        @subjects = Subject.all
        @content = Content.find(params[:content_id])
        @one_subject = Subject.find(@content.subject_id)
        @one_subject.save
    end
    
    # 수정 된 DB를 저장하고, 다시 돌아간다. 
    def update
        @subjects = Subject.all
        @content = Content.find(params[:content_id])
        @content.title = params[:title]
        @content.subject_id = params[:subject_id]
        @content.all_content = params[:all_content]
        
        @content.long_content_q.clear
        @content.long_content_a.clear
        @content.short_content.clear
        # 소스코드로부터 tag 뽑기
        html_doc = Nokogiri::HTML(@content.all_content)
        
        html_doc_p = html_doc.css("p").text
        html_doc_strg = html_doc.css("strong")
        html_doc_rslt = html_doc_p
        
        if html_doc.css("strong").text.nil?
        else 
            (0..(html_doc.css("p").length-1)).each do|j|
                html_doc_p = html_doc.css("p")[j]
                html_doc_p_text = html_doc_p.text
                html_doc_strg = html_doc_p.css("strong")
                html_doc_rslt=html_doc_p_text
                @content.short_content[j] = []
                (0..(html_doc_strg.length-1)).each do |i|
                    html_doc_rslt = html_doc_p_text.gsub!(html_doc_strg[i].text, '_______')
                    html_doc_p_text = html_doc_rslt
                    @content.short_content[j] << html_doc.css("p")[j].css("strong")[i].text
                end
            end
        end
        
        if html_doc.at("span").nil?
        else
            if html_doc.at('span').get_attribute('style').include?("underline")
                hash = Hash.new
            
                (0..(html_doc.css('span').length-2)).each do |i|
                    if i%2 == 0
                        hash[html_doc.css('span')[i].text] = html_doc.css('span')[i+1].text
                    end
                end
                
                # hash를 배열로 저장
                (0..(hash.keys.length-1)).each do |i|
                   @content.long_content_q << hash.keys[i]
                   @content.long_content_a << hash.values[i]
                end
            end
        end
        @content.save
        redirect_to '/contents/detail/' + @content.id.to_s
    end
    
    def delete
        @content = Content.find(params[:content_id])
        @content.destroy
        redirect_to '/subjects/subject_list/' + @content.subject_id.to_s
    end
    
end