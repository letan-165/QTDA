package database

import (
	"embed"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

//go:embed schema.sql
var SchemaSQL embed.FS
var DB *gorm.DB

func ConnectDB() {
    nameDB := "QTDA"
    dsn := "root:root@tcp(127.0.0.1:3306)/"+nameDB+"?charset=utf8mb4&parseTime=True&loc=Local"

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Kết nối database thất bại:", err)
    }

    fmt.Println("Kết nối database thành công")
    InitSchema(db,nameDB)
    DB = db
}
