package dto

type ProfileStudentResponse struct {
	StudentID string
	Name      string
	ClassName string
	Major     string
	Email     string
	Role      string
}

type ProfileResponse struct {
	Username string
	Name     string
	Email    string
	Role     string
}

type DetailInfoStudentResponse struct {
	StudentID string
	ClassName string
	Major     string

	Profile ProfileResponse
}