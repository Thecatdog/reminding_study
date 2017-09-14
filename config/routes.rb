Rails.application.routes.draw do
  resources :meetings
  devise_for :users
  
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  
  root 'user#home'
  get 'users/edit' => 'registrations#edit'
  
  get '/user/edit/:user_id' => 'user#edit'
  post '/user/update/:user_id' => 'user#update'
  
  get 'about-me' => 'user#about-me'
  get '/:user_id/diary' => 'meetings#index'
  
  get '/user/info' => 'user#info'

  # subject routes
  get '/subjects/subject_add'=>'subjects#subject_add'
  post '/subjects/subject_add'=>'subjects#subject_add_new'
  get '/subjects/subject_delete/:s_id'=> 'subjects#subject_delete'
  get '/subjects/subject_list' => 'subjects#subject_list'
  get '/subjects/subject_list/:subject_id' => 'subjects#subject_list'
  
  post '/subjects/subject_list/:subject_id' => 'subjects#subject_list'
  get '/subjects/show'
  
  post '/subjects/update/:subject_id' => 'subjects#update'
  
  # content routes
  get '/contents/content_list' => 'contents#content_list'
  get '/contents/new/:subject_id' => 'contents#new'
  post '/contents/create/:subject_id' => 'contents#create'
  
  get '/contents/detail/:content_id' => 'contents#detail'
  post '/contents/update/:subject_id/:content_id' => 'contents#update'
  get '/detail/edit/:subject_id/:content_id' => 'contents#edit'
  get '/detail/delete/:content_id' => 'contents#delete'
  get '/contents/review' => 'contents#review'
  
  # question routes
  get '/:subject_id/questions/solv_question' => 'questions#solv_question'
  post '/:subject_id/questions/solv_question' => 'questions#solv_question'
    
  get '/:subject_id/questions/choice' => 'questions#choice'
  post '/:subject_id/questions/choice' => 'questions#choice'
  get '/:subject_id/questions/longQ' => 'questions#longQ'
  post '/:subject_id/questions/longQ' => 'questions#longQ'
  get '/:subject_id/questions/shortQ' => 'questions#shortQ'
  post '/:subject_id/questions/shortQ' => 'questions#shortQ'
  post '/:subject_id/questions/wrongQ' => 'questions#wrongQ'
  
  # fail_questions routes
  post '/:subject_id/:user_id/fail_question/add' => 'fail_question#add'
  get '/fail_question/show/:subject_id' => 'fail_question#show'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
