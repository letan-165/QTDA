package dto

type User struct {
	UserID   string `gorm:"primaryKey;column:userID"`
	Username string
	Password string
	Name     string
	Email    string
	Role     string
}

func (User) TableName() string {
	return "User"
}

type Student struct {
	StudentID string `gorm:"primaryKey;column:studentID"`
	ClassName string
	Major     string

	User User `gorm:"foreignKey:StudentID;references:UserID"`
}

func (Student) TableName() string {
	return "Student"
}

type Employee struct {
	EmployeeID string `gorm:"primaryKey;column:employeeID"`
	Department string

	User User `gorm:"foreignKey:EmployeeID;references:UserID"`
}

func (Employee) TableName() string {
	return "Employee"
}