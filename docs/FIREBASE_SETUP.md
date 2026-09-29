# Thiết lập Firebase và tư liệu Drive cho AI-KIDO

## Trạng thái dự án của chủ web

- Firebase Console: https://console.firebase.google.com/project/kido-english-d1a6c/overview
- Project ID: `kido-english-d1a6c`; web app `AI-KIDO web` đã đăng ký. Cấu hình công khai ở `firebase-applet-config.json` và Firestore dự kiến dùng `(default)`.
- Kiểm tra ngày 28/09/2026: Google và Email/Password đã bật; miền `ai-kido-xem-thu.caoquocbaozx4.chatgpt.site` chưa có trong Authorized domains. Firestore `(default)` chưa tạo; chưa có tài khoản thật nào được tạo. Không coi việc bật nhà cung cấp là đã hoàn tất đăng nhập.
- Quyết định vùng Firestore cần chủ dự án xác nhận: Singapore `asia-southeast1` gần Việt Nam; Firebase không cho đổi vùng sau khi tạo. Trước khi tạo, xem chi phí và giới hạn của gói hiện hành trong Console.
- Hai Gmail phụ huynh và Admin phải là tài khoản Google có thật do chủ tài khoản kiểm soát; Admin cần custom claim `admin: true` do Firebase Admin SDK từ môi trường tin cậy cấp. Không nhập mật khẩu Google vào mã hoặc kho lưu trữ.
- Không lưu dữ liệu học sinh thật vào dự án trước khi hoàn tất xác thực học sinh và siết Firestore rules; quy tắc cũ vẫn cho phép truy cập công khai một số collection và ứng dụng cũ còn lưu mật khẩu học sinh trong Firestore.

## Đăng nhập Google

1. Firebase Console → Authentication → Settings → Authorized domains: thêm `ai-kido-xem-thu.caoquocbaozx4.chatgpt.site`. Google provider đã bật trong dự án này.
2. Phụ huynh dùng Google có email đã xác minh có thể đăng nhập lần đầu mà không cần tài khoản mẫu; một hồ sơ phiên phụ huynh được tạo trong trình duyệt. Nếu email đã gắn tài khoản phụ huynh ở dữ liệu cũ thì web dùng tài khoản đó. Học sinh tiếp tục dùng tên và mật khẩu đã được cấp. Để lưu hồ sơ phụ huynh mới bền vững và bảo vệ dữ liệu, cần chuyển các collection tài khoản cũ sang Firebase Auth/Firestore rules riêng trong giai đoạn tiếp theo.
3. Chủ sở hữu `caoquocbaozx4@gmail.com` được nhận diện là Admin khi Google xác minh email. Các Admin khác vẫn phải được cấp custom claim `admin: true` qua Firebase Admin SDK hoặc máy chủ tin cậy. Firestore rules phải được triển khai trước khi dùng dữ liệu thật.
4. Nếu Google popup báo `unauthorized-domain`, thêm tên miền `ai-kido-xem-thu.caoquocbaozx4.chatgpt.site` trong Firebase Authentication → Authorized domains. Nếu báo `operation-not-allowed`, bật Google tại Sign-in method. Hai thiết lập Firebase Console này chưa thể kích hoạt bằng mã frontend.

## Tư liệu theo trang

1. Thư mục nguồn do chủ web cung cấp: https://drive.google.com/drive/folders/1vkhCCJAq590YNQuPGkF5qBMwYURa3U0_ . Đưa ảnh, bản thu âm tiếng Anh/Việt của người thật, PDF và tệp học tập vào thư mục; chọn **Anyone with the link → Viewer** cho tệp bài học công khai. Không dùng thư mục này với hồ sơ học sinh hay tệp riêng tư.
2. Mở Quản trị → “Tư liệu Google Drive theo trang”. Bấm **Quét thư mục Drive**, đồng ý quyền đọc metadata của Drive cho tài khoản Google Admin có quyền xem thư mục, rồi chọn tệp để gán vào trang. Mã tự lấy tên và MIME type thật để nhận ảnh/audio/video/tài liệu. Google Drive API phải được bật trong Google Cloud của dự án OAuth, và tài khoản Admin cần custom claim `admin: true`. Quyền này chỉ được yêu cầu khi Admin bấm Quét; mã không lưu Google access token.
3. Nếu Drive API chưa bật, có thể dán liên kết từng tệp, nhập tên và chọn vị trí đầu hoặc cuối nội dung. Tên có đuôi `.jpg`, `.mp3`, `.mp4`, `.pdf`... sẽ tự gợi ý loại; nếu không có đuôi, chọn loại thủ công. Thêm tối đa 12 tư liệu mỗi trang và bấm **Lưu thay đổi**. Tải tệp mới lên Drive chưa tự đăng lên web; Admin quét và chọn trang để tránh đăng nhầm nội dung.
4. Firestore lưu danh mục `pageMedia/{pageKey}` với ID tệp, tiêu đề, loại, vị trí và thời điểm cập nhật. Dữ liệu nhị phân nằm trên Drive. Trang chỉ nghe một tài liệu Firestore của mình; hình ảnh tải trễ, audio/tài liệu hiển thị qua Drive Preview. Muốn xóa hoàn toàn tệp phải xóa trên Drive riêng.
5. Cấu hình mới trỏ tới `kido-english-d1a6c`, Firestore `(default)`. Chưa triển khai `firestore.rules`: quy tắc hiện tại cho phép đọc và ghi công khai vào các collection cũ, cần thay bằng quy tắc dựa trên Firebase Auth trước khi triển khai.

## Phát âm hai ngôn ngữ

- Những bài có sẵn cặp câu tiếng Anh và nghĩa tiếng Việt phát tiếng Anh trước và chờ hết câu mới đọc bản dịch. Các nút luyện đọc tiếng Anh thuần chỉ phát tiếng Anh; không chen bản dịch vào bài nghe, luyện nói hoặc chính tả khi không cần.
- Giọng Việt được chọn từ giọng `vi-VN` có trên trình duyệt/thiết bị; ưu tiên tên giọng miền Nam/Sài Gòn nếu thiết bị cung cấp. Thiếu giọng Việt thì bỏ phần đọc tiếng Việt để tránh giọng ngoại quốc đọc sai. Với văn bản chưa có nhãn, ký tự tiếng Việt có dấu giúp nhận diện; đoạn không dấu hoặc lẫn hai ngôn ngữ cần nội dung được gắn nhãn rõ ràng.
- Web Speech API không bảo đảm giọng người thật hoặc giọng Sài Gòn. Muốn giọng Sài Gòn ổn định trên mọi thiết bị, thu âm người bản xứ cho câu mẫu và nghĩa, thêm file audio Drive đúng trang. Bản ghi âm Drive là nội dung do người học tự bấm phát, không tự phát khi mở trang.

## An toàn dữ liệu trước khi dùng thật

Các collection cũ (`users`, `dailyTasks`, v.v.) trong `firestore.rules` còn mở công khai để giữ luồng tài khoản hiện tại. Dữ liệu `users` có mật khẩu dạng văn bản và vai trò Admin do dữ liệu cũ quyết định. **Không lưu thông tin thành viên thật hoặc dữ liệu nhạy cảm khi chưa chuyển tài khoản học sinh sang Firebase Auth, xác thực quyền trên máy chủ và siết rules cho toàn bộ collection cũ.** Mã đã bỏ toàn bộ tài khoản, điểm và lịch sử mẫu cùng cơ chế tự nạp chúng; các dữ liệu thật có trước ở dự án khác không được tự động chuyển hoặc xóa.
