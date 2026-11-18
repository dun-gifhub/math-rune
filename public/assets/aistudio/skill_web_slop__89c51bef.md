Hãy "unslop" giao diện HSG CodeJudge (hệ thống chấm bài lập trình cho học sinh
giỏi Tin học) để nó trông như được thiết kế riêng cho sản phẩm này, không phải
mẫu AI mặc định. Giữ nguyên toàn bộ tính năng, nội dung và thứ tự các phần.
Làm theo thứ tự các bước dưới đây, xong bước này mới sang bước sau.

HƯỚNG THIẾT KẾ (áp dụng cho mọi bước)
- Sản phẩm: chấm bài và ôn luyện lập trình C++/Python cho học sinh giỏi.
- Tính cách: bình tĩnh, chính xác, hơi ấm. Không dùng các từ "hiện đại, sang,
  tối giản" để mô tả.
- Thế giới: giấy thi, bảng điểm, mực in, phòng thi.
- Khoảnh khắc nổi bật (chọn một): dải kết quả chấm, mỗi test là một ô nhỏ
  xanh/đỏ/vàng nâu cạnh nhau (kiểu bảng điểm). Đây là chỗ DUY NHẤT được phép
  có nhiều màu.
- Chi tiết đặc trưng (dùng nhất quán, đừng thêm cái khác): phím bấm dạng keycap
  cho Tab / Ctrl+Enter, và số liệu luôn dùng JetBrains Mono.

1. KHOẢNG CÁCH
- Mọi giá trị margin/padding/gap/chiều cao là bội của 4px.
- Cùng loại thì cùng kích thước: mọi hàng trong danh sách cùng chiều cao,
  mọi thẻ cùng padding.
- Khoảng cách trong một nhóm nhỏ hơn khoảng cách giữa các nhóm.
- Sidebar: hàng cao 32-36px, cách nhau 2-4px, tiêu đề nhóm gần các mục của nó
  hơn phần phía trên (khoảng 24 trên, 8 dưới). Biểu tượng và nhãn thẳng cột.
- Xóa các giá trị lẻ như mt-[13px], py-[11px].

2. MÀU
- Một dải màu trung tính ấm nhẹ: nền, thẻ, viền, chữ đều lấy từ đó.
  Nền và bề mặt phải gần xám/kem, không được ngả cam, nâu, xanh.
- Ba vai trò chữ: chính, phụ, mờ. Một màu nhấn duy nhất, dùng ít: nút chính,
  mục đang chọn. Chữ trên màu nhấn đạt tương phản 4.5:1.
- Màu trạng thái chỉ mang ý nghĩa (AC xanh, WA đỏ, TLE vàng, CE xám), giảm độ
  bão hòa cho hợp bảng màu.
- Cấm: gradient màu, chữ gradient, glow, bóng đổ có màu, vệt màu mờ phía sau
  nội dung, viền neon, glassmorphism.
- Viền là đường mảnh: màu chữ ở độ mờ 6-10%. Bóng đổ nếu có thì trung tính,
  nhỏ, nhẹ.
- Khung soạn code dùng nền sáng (hoặc xám than rất nhạt), không dùng đen tuyền
  và không dùng màu neon. Tô cú pháp bằng tông trầm.

3. ICON
- Không còn emoji trong giao diện. Dùng một bộ icon duy nhất (lucide),
  một cỡ 16px, nét 1.5, màu theo vai trò chữ (phụ hoặc mờ).
- Bỏ icon không có tác dụng.

4. NỘI DUNG CHỮ
- Mô tả bằng lời thường, nói đúng sản phẩm làm gì cho ai, dựa trên thông tin
  đã có, không bịa thêm.
- Không dấu chấm than, không lời chào kiểu "Chào mừng bạn trở lại!".
- Nhãn ngắn. Tiêu đề, nhãn, nút không kết thúc bằng dấu chấm.
- Không từ quảng cáo (mạnh mẽ, đột phá, thông minh, tối ưu...). Không ghi
  "AI-powered".
- Dữ liệu mẫu phải giống thật (tên, số điểm, thời gian hợp lý).
- Thay đổi so với kỳ trước phải ghi rõ so với gì, ví dụ "+2 bài so với tuần trước".

5. KIỂU CHỮ
- Giữ Be Vietnam Pro + JetBrains Mono. Chỉ hai độ đậm 400 và 500, tối đa 600
  cho điểm nhấn hiếm. Phân cấp bằng cỡ chữ và màu, không bằng chữ đậm.
- Câu thường, không viết hoa toàn bộ, không tăng giãn chữ cho nhãn nhỏ.
- Chữ nhỏ không dùng letter-spacing âm.
- Số dùng tabular-nums và một định dạng thống nhất.
- Không in nghiêng để nhấn mạnh.

6. BỐ CỤC
- Đây là ứng dụng nên giữ tỉ lệ ứng dụng thật: sidebar 240-280px, nội dung
  co giãn, khung tối đa khoảng 1440-1600px. Đừng co thành cột hẹp ở giữa.
- Thanh điều hướng gọn: logo, các link hiện có, một nút. Trang dài đúng bằng
  nội dung.
- Mỗi màn hình chỉ có một hành động chính và tối đa một hành động phụ.
- Trên điện thoại: mọi thứ xếp dọc theo thứ tự đọc, không có chữ dưới 11px.

7. CHI TIẾT
- Bo góc lồng nhau: bo góc trong = bo góc ngoài trừ padding giữa chúng
  (tối thiểu 4). Nút và ô nhập 8-10, thẻ 12-16. Không phải thứ gì cũng bo tròn.
- Số lượng, thông tin phụ là chữ mờ (thường dùng mono), không phải nhãn phát sáng.
- Phím tắt hiển thị bằng keycap nhỏ.
- Bảng xếp hạng: nền lưới mờ, nhãn mờ. Một màu nhấn cho dòng quan trọng
  (ví dụ hạng của bạn), phần còn lại là các bậc trung tính.
- Trạng thái đang chọn là một bậc nền nhẹ kèm viền mảnh, không gradient hay glow.
- Có trạng thái hover và focus rõ ràng, nằm trong bảng màu.
- Logo là tên "HSG CodeJudge" bằng phông chính, không có icon lấp lánh.

8. HÌNH ẢNH
- Không thêm hình trang trí (blob, quả cầu, lưới phát sáng, robot).
- Khoảnh khắc nổi bật nằm trong chính sản phẩm: dải kết quả theo từng test,
  bảng điểm sắp đẹp.

9. CHUYỂN ĐỘNG
- Xóa mọi hiệu ứng lặp (animate-pulse, ping, shimmer), transition-all,
  scale khi hover, hiệu ứng nảy.
- Giữ chuyển động có ý nghĩa: đổi màu/nền nhanh khi hover, menu hiện lên vài px.
- Chỉ chuyển màu, nền, viền, opacity, transform. Không animate width, height,
  margin. Một đường cong easing duy nhất.

KIỂM TRA TRƯỚC KHI TRẢ KẾT QUẢ
- Không còn tím/chàm, neon, gradient, glow, emoji, chữ viết hoa, dấu chấm than.
- Mọi khoảng cách chia hết cho 4. Mọi màu lấy từ biến :root.
- Phần màu phía trên màn hình đầu tiên chủ yếu là nền trung tính sáng.
- Thử đổi tên sản phẩm thành sản phẩm khác: nếu giao diện vẫn khớp thì chưa
  đủ riêng, hãy làm rõ chi tiết đặc trưng và khoảnh khắc nổi bật hơn.

Khi xong, báo lại: hướng thiết kế đã chọn, mỗi bước đã đổi gì (vài dòng),
danh sách file đã sửa.