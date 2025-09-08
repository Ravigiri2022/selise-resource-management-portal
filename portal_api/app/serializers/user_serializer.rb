class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :availability, :jobTitle, :colorHex
end
