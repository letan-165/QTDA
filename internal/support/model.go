package support

import (
	"QTDA/internal/user/dto"
	"time"
)

type Support struct {
	SupportID string    `gorm:"primaryKey;column:supportID"`
	StudentID string    `gorm:"column:studentID"`
	Type      string
	Status    string
	Title     string
	CreatedAt time.Time
	Content   string

	Student dto.Student `gorm:"foreignKey:StudentID;references:StudentID"`
}

func (Support) TableName() string {
	return "Support"
}

type Response struct {
	ResponseID string    `gorm:"primaryKey;column:responseID"`
	SupportID  string    `gorm:"column:supportID"`
	EmployeeID string    `gorm:"column:employeeID"`
	Title      string
	CreatedAt  time.Time
	Content    string

	Support  Support         `gorm:"foreignKey:SupportID;references:SupportID"`
	Employee dto.Employee   `gorm:"foreignKey:EmployeeID;references:EmployeeID"`
}

func (Response) TableName() string {
	return "Response"
}
