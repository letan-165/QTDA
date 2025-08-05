package com.app.qtda.common.runner;

import com.app.qtda.internal.support.entity.SupportType;
import com.app.qtda.internal.support.repository.SupportTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportTypeRunner implements ApplicationRunner {

    SupportTypeRepository supportTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (supportTypeRepository.count() == 0)
            supportTypeRepository.saveAll(createDefaultSupportType());
    }

    List<SupportType> createDefaultSupportType() {
        return List.of(
                SupportType.builder().name("Đăng ký học bổng").description("Sinh viên đăng ký các chương trình học bổng đang triển khai").build(),
                SupportType.builder().name("Học bổng học tập").description("Hỗ trợ sinh viên có thành tích học tập xuất sắc").build(),
                SupportType.builder().name("Học bổng vượt khó").description("Dành cho sinh viên có hoàn cảnh khó khăn, vươn lên trong học tập").build(),
                SupportType.builder().name("Miễn/giảm học phí").description("Hỗ trợ tài chính trực tiếp giảm gánh nặng học phí").build(),
                SupportType.builder().name("Hỗ trợ thiết bị học tập").description("Cấp laptop, điện thoại, gói mạng cho sinh viên không có thiết bị").build(),
                SupportType.builder().name("Thắc mắc kết quả học tập").description("Kiểm tra hoặc khiếu nại điểm").build(),
                SupportType.builder().name("Hỗ trợ khẩn cấp").description("Dành cho sinh viên gặp biến cố bất ngờ").build(),
                SupportType.builder().name("Hỗ trợ chỗ ở").description("Miễn/ưu tiên chỗ ở ký túc xá cho sinh viên khó khăn").build(),
                SupportType.builder().name("Hỗ trợ y tế").description("Khám bệnh, thuốc men hoặc BHYT cho sinh viên").build(),
                SupportType.builder().name("Tư vấn tâm lý học đường").description("Hỗ trợ tinh thần, tâm lý cho sinh viên").build(),
                SupportType.builder().name("Hỗ trợ sinh viên khuyết tật").description("Hỗ trợ đặc biệt cho sinh viên khuyết tật").build(),
                SupportType.builder().name("Hỗ trợ nghề nghiệp").description("Hướng nghiệp, kết nối việc làm, hỗ trợ thực tập").build(),
                SupportType.builder().name("Hỗ trợ sự kiện").description("Hỗ trợ tổ chức và tham gia sự kiện").build(),
                SupportType.builder().name("Góp ý - khiếu nại chung").description("Các phản hồi khác về dịch vụ, CSVC,...").build()
        );
    }
}
