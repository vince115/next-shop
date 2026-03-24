package com.nextshop.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, Long> {

    boolean existsByRequestId(String requestId);

    List<AdminActionLog> findByOrderIdOrderByTimestampDesc(Long orderId);
}
