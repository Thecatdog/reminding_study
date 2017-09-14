
admin_user = User.create(email: 'admin@email.com', password: '123456', name:'관리자', school: '동덕여자대학교', major: 'asdfsadf')
admin_user.add_role :admin

User.create(email: 'james5809@naver.com', password: '123456', name:'똥멍청', school: '연세대학교', major: '컴퓨터학과')
User.create(email: 'rima@email.com', password: '123456', name: '이림아', school: '동덕여자대학교', major: '컴퓨터학과')
User.create(email: 'shdbwjd0326@naver.com', password: '123456', name: '노유정', school: '동덕여자대학교', major: '컴퓨터학과')
User.create(email: 'nayoung8110@likelion.org', password: '123456', name: '김나영', school: '동덕여자대학교', major: '컴퓨터학과')

Subject.create(sub_name: 'sample과목', dday: '20180101')

Study.create(subject_id: '1', user_id: '1', all_count: '0', xcount: '0')
Study.create(subject_id: '1', user_id: '1', all_count: '0', xcount: '0')
Study.create(subject_id: '1', user_id: '1', all_count: '0', xcount: '0')
Study.create(subject_id: '1', user_id: '1', all_count: '0', xcount: '0')

Content.create(subject_id: '1', user_id: '1', title: 'sample_주관식만', 
    all_content: '	<p>[뉴미디어와 인터넷]</p> <p>&lt;1. 뉴미디어의 도입과 확산&gt;</p> <p>∙ 뉴미디어의 개념</p> <p>- <span style="text-decoration: underline;">상대적 개념</span> : <span style="text-decoration: underline;">특정 미디어가 뉴미디어인가는 상대적인 시점에 달려 있음</span></p> <p>- 진화 VS. 혁명 : 뉴미디어의 정의에 대한 두 가지 관점</p> <p>↳ <span style="text-decoration: underline;">진화론적 관점</span> : <span style="text-decoration: underline;">기존 미디어에 새로운 정보처리 및 정보전달 기술이 부분적으로 부가</span></p> <p>↳ <span style="text-decoration: underline;">혁명론적 관점</span> : <span style="text-decoration: underline;">기존 미디어와는 전혀 다른 새로운 정보교환 기능을 갖춘 미디어</span></p> <p>- 일반적 정의 : 고도의 정보처리 및 정보전송 기술이 추가된 미디어</p> <p>∙ 방송과 통신의 융합</p> <p>- <span style="text-decoration: underline;">방송/통신 융합</span> : <span style="text-decoration: underline;">방송과 통신을 구분하던 기준 소멸&nbsp;</span></p> <p>예) 기존 방송 네트워크를 이용, 통신 서비스 제공/통신 네트워크를 통하여 방송서비스 제공</p> <p>- 융합으로 인한 새로운 서비스</p> <p>↳ 방송과 통신의 속성을 모두 보유하여 분류하기 어려움</p>', 
    short_content: [[], [], [], [], [], [], [], [], [], [], [], [], []], 
    long_content_q: ["상대적 개념", "진화론적 관점", "혁명론적 관점", "방송/통신 융합"], 
    long_content_a: ["특정 미디어가 뉴미디어인가는 상대적인 시점에 달려 있음", "기존 미디어에 새로운 정보처리 및 정보전달 기술이 부분적으로 부가", "기존 미디어와는 전혀 다른 새로운 정보교환 기능을 갖춘 미디어", "방송과 통신을 구분하던 기준 소멸 "])
  
Content.create(subject_id: '1', user_id: '1', title: 'sample_빈칸만', 
    all_content: '<p>∙ 뉴미디어의 특징</p> <p>- <strong>상호작용성</strong> : 양방향 커뮤니케이션 / 사회 구성원 간의 상호연결성이 뛰어남</p> <p>- 비동시성 : 송신 지점과 수신 시점이 일치하지 않음</p> <p>- <strong>디지털</strong> : 정보처리 및 정보전달의 기능을 <strong>극대화</strong>, <strong>고품질화</strong></p> <p>- <strong>영상화</strong> : 모든 메시지가 <strong>영상</strong>을 통해 전달</p> <p>- 멀티미디어 : 별도의 영역으로 존재해 왔던 매체들이 하나로 통합</p> <p>- 이동성 : 이용 장소와 시간에 구애 받지 않음</p> <p>- <strong>탈대중화</strong> : 특정 집단, 선정된 특정인에게 필요한 메시지를 <strong>선별적</strong>으로 전달</p> <p>- 편재성 : 전 세계적, 사회 모든 계층에 이르기까지 체계적으로 보급</p>', 
    short_content: 	[[], ["상호작용성"], [], ["디지털", "극대화", "고품질화"], ["영상화", "영상"], [], [], ["탈대중화", "선별적"], []], 
    long_content_q: [], 
    long_content_a: [])
  
Content.create(subject_id: '1', user_id: '1', title: 'sample_빈칸주관식둘다', 
    all_content: '<p>&lt;2. 뉴미디어와 사회 변동&gt;</p> <p>∙ 커뮤니케이션의 변화</p> <p>- <strong>뉴미디어</strong>의 등장 &rarr; <strong>기존 커뮤니케이션</strong>의 형태 변경</p> <p>- 새로운 커뮤니케이션 기술은 사회 변동에 긍정적 / 부정적으로 작용</p> <p>-- <span style="text-decoration: underline;">긍정적 변화</span> : <span style="text-decoration: underline;">기존 사회구조를 보다 편리하고 바람직한 방향으로 변화</span></p> <p>-- <span style="text-decoration: underline;">부정적 변화</span> : <span style="text-decoration: underline;">도덕적 타락이나 인간관계의 황폐화 등 바람직하지 못한 방향으로 변화</span></p> <p>- <strong>뉴미디어</strong>는 직접적 / 간접적으로 영향을 미칠 수 있음</p> <p>-- <span style="text-decoration: underline;">직접적 영향</span> : <span style="text-decoration: underline;">혁신에 대한 즉각적 반응의 결과로 발생하는 개인 또는 사회체계 내의 변화</span></p> <p>-- 간접적 영향 : 장기간에 걸쳐 <strong>가치관</strong>, <strong>사고방식</strong> 등에 영향을 미침으로써 <strong>사회 변동</strong>에 영향</p> <p>&nbsp;</p>', 
    short_content: [[], [], ["뉴미디어", "기존 커뮤니케이션"], [], [], [], ["뉴미디어"], [], ["가치관", "사고방식", "사회 변동"], []], 
    long_content_q: ["긍정적 변화", "부정적 변화", "직접적 영향"], 
    long_content_a: ["기존 사회구조를 보다 편리하고 바람직한 방향으로 변화", "도덕적 타락이나 인간관계의 황폐화 등 바람직하지 못한 방향으로 변화", "혁신에 대한 즉각적 반응의 결과로 발생하는 개인 또는 사회체계 내의 변화"])
    
FailQuestion.create(
    subject_id:	'1', user_id: '1',
    f_q_content: '- 상호작용성 : 양방향 커뮤니케이션 / 사회 구성원 간의 상호연결성이 뛰어남,- 디지털 : 정보처리 및 정보전달의 기능을 극대화, 고품질화,- 영상화 : 모든 메시지가 영상을 통해 전달,- 탈대중화 : 특정 집단, 선정된 특정인에게 필요한 메시지를 선별적으로 전달')