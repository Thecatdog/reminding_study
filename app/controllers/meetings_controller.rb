class MeetingsController < ApplicationController
  before_action :set_meeting, only: [:show, :edit, :update, :destroy]

  # GET /meetings
  # GET /meetings.json
  def index
    if (current_user.email == "admin@email.com")
      @subjects = Subject.all
      @meetings = Meeting.all
    else
      @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
      @meetings = Meeting.where(user_id: current_user.id)
    end

  end

  # GET /meetings/1
  # GET /meetings/1.json
  def show
    
  end

  # GET /meetings/new
  def new
    if(current_user.email == "admin@email.com")
        @subjects = Subject.all
    else
        @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
    end
    @meeting = Meeting.new
    
  end

  # GET /meetings/1/edit
  def edit
    if(current_user.email == "admin@email.com")
        @subjects = Subject.all
    else
        @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").all
    end
  end

  # POST /meetings
  # POST /meetings.json
  def create
    
    if(current_user.email == "admin@email.com")
        @subjects = Subject.all
    else
        @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
    end
    
    @meeting = Meeting.new(meeting_params)
    @meeting.user_id = current_user.id

    respond_to do |format|
      if @meeting.save
        # format.html { redirect_to @meeting, notice: 'Meeting was successfully created.' }
        # format.json { render :index, status: :created, location: @meeting }
        format.html { redirect_to meetings_url}
        format.json { head :no_content }
      else
        format.html { render :new }
        format.json { render json: @meeting.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /meetings/1
  # PATCH/PUT /meetings/1.json
  def edit
    if(current_user.email == "admin@email.com")
      @subjects = Subject.all
    else
      @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
    end
  end
  
  def update
    
    if(current_user.email == "admin@email.com")
      @subjects = Subject.all
    else
      @subjects = Subject.joins("INNER JOIN studies ON studies.subject_id = subjects.id AND studies.user_id = '#{current_user.id}'").distinct
    end
    
    respond_to do |format|
      if @meeting.update(meeting_params)
        # format.html { redirect_to @meeting, notice: 'Meeting was successfully updated.' }
        # format.json { render :show, status: :ok, location: @meeting }
        format.html { redirect_to meetings_url, notice: @meeting.start_time.in_time_zone("Asia/Seoul").strftime("%F")+' 이벤트가 성공적으로 갱신되었습니다.' }
        format.json { head :no_content }
      else
        format.html { render :edit }
        format.json { render json: @meeting.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /meetings/1
  # DELETE /meetings/1.json
  def destroy
    
    @meeting.destroy
    respond_to do |format|
      format.html { redirect_to meetings_url, notice: @meeting.start_time.in_time_zone("Asia/Seoul").strftime("%F")+' 이벤트가 성공적으로 삭제되었습니다.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    
    def set_meeting
      @meeting = Meeting.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def meeting_params
      params.require(:meeting).permit(:name, :start_time, :end_time)
    end
  
end
