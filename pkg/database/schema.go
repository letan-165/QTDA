package database

import (
	"fmt"
	"log"
	"strings"

	"gorm.io/gorm"
)

func InitSchema(db *gorm.DB, nameDB string) {
	var exists int64
	db.Raw("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ? AND table_name = ?", nameDB , "User").Scan(&exists)

	if exists > 0 {
		fmt.Println("Cơ sở dữ liệu đã có bảng, không cần chạy schema.sql")
		return
	}

	fmt.Println("Chạy schema.sql vì bảng chưa tồn tại")

	sqlBytes, err := SchemaSQL.ReadFile("schema.sql")
	if err != nil {
		log.Fatal("Không đọc được file schema.sql:", err)
	}

	// Tách và chạy từng lệnh SQL
	commands := strings.Split(string(sqlBytes), ";")
	for _, cmd := range commands {
		cmd = strings.TrimSpace(cmd)
		if cmd != "" {
			fmt.Println("Thực thi lệnh:", cmd)
			if err := db.Exec(cmd).Error; err != nil {
				log.Fatalf("Lỗi khi thực thi SQL: %v\nLệnh: %s\n", err, cmd)
			}
		}
	}

	fmt.Println("Tạo bảng thành công từ schema.sql")
}
