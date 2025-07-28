package notification

import (
	"QTDA/internal/user/dto"
	"time"
)

type Notification struct {
	NotificationID string    `gorm:"primaryKey;column:notificationID"`
	SAffairsID     string    `gorm:"column:sAffairsID"`
	Title          string
	CreatedAt      time.Time
	Content        string

	Employee dto.Employee `gorm:"foreignKey:SAffairsID;references:EmployeeID"`
}

func (Notification) TableName() string {
	return "Notification"
}
