Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users do
        member do
          get :tasks
        end
      end
      resources :tasks do
        member do
          get :logs
        end
      end
      resources :projects
      resources :reschedule_logs
    end
  end
end
