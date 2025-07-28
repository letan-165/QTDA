package dto

type UserSaveRequest struct {
	Username string
	Password string
	Name     string
	Email    string
	Role     string

	ClassName string
	Major     string

	Department string
}
type SignUpsRequest struct {
	Users []UserSaveRequest
}

type LoginRequest struct {
	Username string
	Password string
}