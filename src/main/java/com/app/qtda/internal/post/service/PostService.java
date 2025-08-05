package com.app.qtda.internal.post.service;

import com.app.qtda.common.enums.NotificationType;
import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.post.dto.request.ListPostSaveRequest;
import com.app.qtda.internal.post.dto.request.PostSaveRequest;
import com.app.qtda.internal.post.dto.response.PostResponse;
import com.app.qtda.internal.post.entity.Event;
import com.app.qtda.internal.post.entity.Notification;
import com.app.qtda.internal.post.entity.Scholarship;
import com.app.qtda.internal.post.mapper.PostMapper;
import com.app.qtda.internal.post.repository.EventRepository;
import com.app.qtda.internal.post.repository.NotificationRepository;
import com.app.qtda.internal.post.repository.ScholarshipRepository;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostService {
    NotificationRepository notificationRepository;
    EventRepository eventRepository;
    ScholarshipRepository scholarshipRepository;
    PostMapper postMapper;
    StaffRepository staffRepository;


    public List<PostResponse> getNotifications() {
        var lists = notificationRepository.findAll();
        return lists.stream()
                .map(notification -> {
                    switch (notification.getType()) {
                        case DEFAULT -> {
                            return postMapper.toPostResponse(notification);
                        }
                        case EVENT -> {
                            Event event = eventRepository.findByNotification_notificationID(notification.getNotificationID())
                                    .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NO_EXISTS));
                            return postMapper.toPostResponse(event);
                        }
                        case SCHOLARSHIP -> {
                            Scholarship scholarship = scholarshipRepository.findByNotification_notificationID(notification.getNotificationID())
                                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NO_EXISTS));
                            return postMapper.toPostResponse(scholarship);
                        }
                        default -> throw new AppException(ErrorCode.ROLE_INVALID);
                    }
                }).toList();
    }

    public List<PostResponse> getEvents() {
        var lists = eventRepository.findAll();
        return lists.stream()
                .map(postMapper::toPostResponse)
                .toList();
    }


    public List<PostResponse> getScholarships() {
        var lists = scholarshipRepository.findAll();
        return lists.stream()
                .map(postMapper::toPostResponse)
                .toList();
    }

    //Chưa có dieu kien sua  TYPE
    public List<PostResponse> saves(ListPostSaveRequest requests){
        Staff staff = staffRepository.findById(requests.getStaffID())
                .orElseThrow(()->new AppException(ErrorCode.STAFF_NO_EXISTS));
        List<PostResponse> postResponses = new ArrayList<>();
        List<Notification> notifications = new ArrayList<>();
        List<Event> events = new ArrayList<>();
        List<Scholarship> scholarships = new ArrayList<>();

        for (PostSaveRequest request :requests.getPosts()){
            Notification notification = postMapper.toNotification(request);
            notification.setStaff(staff);
            if(notification.getNotificationID()!=null){
                Notification notificationDB = notificationRepository.findById(notification.getNotificationID())
                        .orElseThrow(()->new AppException(ErrorCode.NOTIFICATION_NO_EXISTS));
                notification.setCreateAt(notificationDB.getCreateAt());
            }

            switch (request.getType()){
                case DEFAULT: {
                    notifications.add(notification);
                    break;
                }
                case EVENT: {
                    Event event = postMapper.toEvent(request.getEvent());
                    if(event.getEventID()!=null){
                        Event eventDB = eventRepository.findById(event.getEventID())
                                .orElseThrow(()-> new AppException(ErrorCode.EVENT_NO_EXISTS));

                        if(!eventDB.getNotification().getType().equals(NotificationType.EVENT))
                            throw new AppException(ErrorCode.TYPE_UPDATE_INVALID);
                    }

                    event.setNotification(notification);
                    events.add(event);
                    break;
                }
                case SCHOLARSHIP: {
                    Scholarship scholarship = postMapper.toScholarship(request.getScholarship());
                    if(scholarship.getScholarshipID()!=null){
                        Scholarship scholarshipDB = scholarshipRepository.findById(scholarship.getScholarshipID())
                                .orElseThrow(()-> new AppException(ErrorCode.SCHOLARSHIP_NO_EXISTS));

                        if(!scholarshipDB.getNotification().getType().equals(NotificationType.SCHOLARSHIP))
                            throw new AppException(ErrorCode.TYPE_UPDATE_INVALID);
                    }
                    scholarship.setNotification(notification);
                    scholarships.add(scholarship);
                    break;
                }
                default: {
                    throw new AppException(ErrorCode.TYPE_INVALID);
                }
            }
        }

        notificationRepository.saveAll(notifications)
                .forEach(notification -> postResponses.add(postMapper.toPostResponse(notification)));
        eventRepository.saveAll(events)
                .forEach(event -> postResponses.add(postMapper.toPostResponse(event)));
        scholarshipRepository.saveAll(scholarships)
                .forEach(scholarship -> postResponses.add(postMapper.toPostResponse(scholarship)));

        return postResponses;
    }

    public List<Long> deletes(List<Long> notificationIDs){
        var notifications =  notificationRepository.findAllById(notificationIDs);
        notificationRepository.deleteAllById(notificationIDs);
        return notifications.stream()
                .map(Notification::getNotificationID)
                .toList();
    }


}
