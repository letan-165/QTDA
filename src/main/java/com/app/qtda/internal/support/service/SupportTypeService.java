package com.app.qtda.internal.support.service;

import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.support.dto.request.SupportTypeDeletesRequest;
import com.app.qtda.internal.support.dto.request.SupportTypeSavesRequest;
import com.app.qtda.internal.support.entity.SupportType;
import com.app.qtda.internal.support.repository.SupportTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportTypeService {
    SupportTypeRepository supportTypeRepository;

    public List<SupportType> findAll() {
        return supportTypeRepository.findAll();
    }

    public SupportType findById(Long id) {
        return supportTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_TYPE_NO_EXISTS));
    }

    public List<SupportType> save(SupportTypeSavesRequest request) {
        for (SupportType supportType :request.getSupportTypes()){
            var id = supportType.getSupportTypeID();
            if(id!=null && !supportTypeRepository.existsById(id))
                throw new AppException(ErrorCode.SUPPORT_TYPE_NO_EXISTS);
        }

        return supportTypeRepository.saveAll(request.getSupportTypes());
    }

    public void delete(SupportTypeDeletesRequest request) {
        for (Long id :request.getSupportTypeIDs()){
            if(supportTypeRepository.existsById(id))
                throw new AppException(ErrorCode.SUPPORT_TYPE_NO_EXISTS);
        }
        supportTypeRepository.deleteAllById(request.getSupportTypeIDs());
    }

}
