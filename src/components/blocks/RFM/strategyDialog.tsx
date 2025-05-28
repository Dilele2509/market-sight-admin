"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Award, BarChart, Lightbulb } from "lucide-react"
import { translateSegmentName } from "@/utils/rfmFunctionHelper"
import ReactMarkdown from 'react-markdown';

type Segment = {
    name: string
    percentage: string
}

interface StrategyDialogProps {
    selectedSegment: Segment | null
    onClose: () => void
}

const marketingStrategies: Record<string, Record<string, object>> = {
    "Champions": {
        "0-25%": {
            "rate": "Bình thường, cần giữ vững",
            "suggest": [
                {
                    "title": "Duy trì liên lạc cá nhân hóa",
                    "details": "Gửi email cá nhân hóa (không phải email marketing hàng loạt) định kỳ 1-2 lần/tháng. Nội dung tập trung vào việc hỏi thăm, cập nhật thông tin hữu ích liên quan đến sở thích/lịch sử mua hàng, lời chúc mừng sinh nhật kèm ưu đãi nhỏ, thông báo sản phẩm mới phù hợp. Ưu tiên kênh email và tin nhắn trực tiếp qua các nền tảng chat."
                },
                {
                    "title": "Cung cấp quyền lợi VIP cơ bản",
                    "details": "Thông báo sớm về các chương trình khuyến mãi lớn hoặc sản phẩm mới sắp ra mắt. Đảm bảo phản hồi nhanh chóng và hỗ trợ nhiệt tình khi có thắc mắc hoặc vấn đề (ưu tiên trong hàng đợi hỗ trợ). Gửi một món quà cảm ơn nhỏ (voucher giảm giá, sản phẩm dùng thử miễn phí) sau giao dịch quan trọng hoặc dịp đặc biệt."
                },
                {
                    "title": "Khuyến khích tương tác và phản hồi",
                    "details": "Gửi khảo sát ngắn gọn về trải nghiệm mua sắm và sản phẩm, sử dụng câu hỏi mở. Khuyến khích viết đánh giá trên các nền tảng công khai hoặc chia sẻ trải nghiệm trên mạng xã hội bằng cách cung cấp ưu đãi nhỏ cho mỗi lượt đánh giá chất lượng. Lắng nghe chủ động và phản hồi nhanh chóng, chân thành."
                }
            ]
        },
        "26-50%": {
            "rate": "Tốt, có thể phát triển thêm",
            "suggest": [
                {
                    "title": "Tri ân bằng ưu đãi độc quyền và cá nhân hóa sâu hơn",
                    "details": "Cung cấp quà tặng có giá trị hơn vào các dịp lễ lớn hoặc sự kiện đặc biệt của thương hiệu. Phân tích dữ liệu mua hàng để tạo ưu đãi hoặc gói sản phẩm/dịch vụ phù hợp riêng với sở thích và nhu cầu từng khách hàng. Nếu có hệ thống membership, cung cấp lộ trình rõ ràng để họ thăng hạng và nhận nhiều quyền lợi hơn."
                },
                {
                    "title": "Xây dựng cộng đồng độc quyền",
                    "details": "Tạo một nhóm kín trên mạng xã hội (Facebook, Zalo) hoặc diễn đàn riêng tư cho khách hàng trung thành để họ giao lưu, chia sẻ kinh nghiệm, nhận thông tin nội bộ. Cung cấp nội dung giá trị chỉ dành cho thành viên nhóm (hướng dẫn sử dụng chuyên sâu, mẹo vặt, behind-the-scenes). Mời tham gia thử nghiệm sản phẩm/dịch vụ mới trước khi ra mắt công chúng và thu thập phản hồi."
                }
            ]
        },
        "51-75%": {
            "rate": "Rất tốt, bắt đầu thêm nhiều ưu đãi hơn",
            "suggest": [
                {
                    "title": "Chương trình giới thiệu bạn bè (Referral Program) hấp dẫn",
                    "details": "Xây dựng chương trình referral với cơ chế thưởng rõ ràng cho cả người giới thiệu và người được giới thiệu (ví dụ: hoa hồng, voucher, sản phẩm miễn phí). Đảm bảo mức thưởng đủ hấp dẫn để khuyến khích giới thiệu. Cung cấp hệ thống dễ dàng để họ theo dõi số lượt giới thiệu thành công và thưởng nhận được."
                },
                {
                    "title": "Phát triển chương trình đại sứ thương hiệu vi mô",
                    "details": "Dựa trên mức độ tương tác, ảnh hưởng trên mạng xã hội và lịch sử mua hàng, mời khách hàng tiềm năng trở thành đại sứ vi mô. Cung cấp quyền lợi đặc biệt như sản phẩm/dịch vụ miễn phí, ưu đãi riêng, cơ hội hợp tác trong chiến dịch marketing, hoặc được xuất hiện trên các kênh truyền thông của thương hiệu. Cung cấp công cụ và hướng dẫn để họ dễ dàng chia sẻ và giới thiệu sản phẩm/dịch vụ."
                }
            ]
        },
        "76-100%": {
            "rate": "Tuyệt vời, dấu hiệu doanh nghiệp khỏe mạnh — duy trì & khai thác triệt để",
            "suggest": [
                {
                    "title": "Tổ chức sự kiện đặc biệt và trải nghiệm độc quyền",
                    "details": "Tổ chức tiệc tri ân, gặp mặt thân mật, hoặc sự kiện đặc biệt (ra mắt sản phẩm, hội thảo chuyên đề) chỉ dành riêng cho nhóm khách hàng này. Cung cấp trải nghiệm không thể mua bằng tiền như tour tham quan, buổi trò chuyện với CEO, workshop đặc biệt. Cân nhắc ưu đãi 'trọn đời' hoặc giảm giá vĩnh viễn cho một số sản phẩm/dịch vụ."
                },
                {
                    "title": "Cá nhân hóa sâu toàn bộ hành trình và tạo nội dung độc quyền",
                    "details": "Chỉ định một người quản lý tài khoản riêng hoặc chuyên viên hỗ trợ cá nhân. Gửi báo cáo phân tích thị trường chuyên sâu, tài liệu nghiên cứu độc quyền, hoặc thông tin nội bộ không công khai. Mời tham gia các cuộc họp chiến lược nội bộ (có giới hạn) để đóng góp ý kiến về sản phẩm, dịch vụ, hoặc định hướng phát triển. Cân nhắc các hình thức hợp tác chiến lược, tài trợ hoặc đồng phát triển sản phẩm/dịch vụ với khách hàng siêu VIP có ảnh hưởng lớn."
                }
            ]
        }
    },
    "Loyal Customers": {
        "0-25%": {
            "rate": "Cần cải thiện giữ chân",
            "suggest": [
                {
                    "title": "Chủ động thu thập và phân tích phản hồi để cải thiện sản phẩm/dịch vụ",
                    "details": "Không chỉ khuyến khích đánh giá, mà cần chủ động tạo các kênh thu thập phản hồi đa dạng: **khảo sát sau mua hàng** (email, pop-up trên website), **phỏng vấn khách hàng tiềm năng/khách hàng đã rời bỏ**, **hộp thư góp ý trực tuyến**. Đặc biệt, hãy **phân tích sâu các phản hồi tiêu cực** để tìm ra nguyên nhân gốc rễ và **triển khai hành động khắc phục cụ thể**. Thông báo cho khách hàng về những thay đổi đã được thực hiện dựa trên góp ý của họ để thể hiện sự lắng nghe và trân trọng. Ví dụ: 'Cảm ơn quý khách đã góp ý về vấn đề giao hàng, chúng tôi đã triển khai thêm đối tác vận chuyển để rút ngắn thời gian'."
                },
                {
                    "title": "Tối ưu hóa trải nghiệm khách hàng tại các điểm chạm quan trọng",
                    "details": "Đánh giá lại **từng bước trong hành trình khách hàng**, từ lúc họ tìm kiếm thông tin, mua hàng, nhận hàng, đến sử dụng sản phẩm và liên hệ hỗ trợ. **Tập trung cải thiện các điểm chạm 'đau đớn'** (pain points) mà khách hàng thường gặp phải. Ví dụ: **đơn giản hóa quy trình đặt hàng**, **cải thiện tốc độ tải trang web**, **tối ưu hóa quy trình đổi trả hàng hóa**, **đảm bảo thông tin sản phẩm rõ ràng và đầy đủ**. Mục tiêu là mang lại một trải nghiệm mượt mà, tiện lợi và không gây thất vọng."
                },
                {
                    "title": "Xây dựng chiến dịch tái kích hoạt khách hàng (Win-back Campaigns)",
                    "details": "Đối với những khách hàng đã lâu không tương tác hoặc mua hàng, hãy thiết kế các **chiến dịch Win-back cá nhân hóa**. Gửi email hoặc tin nhắn với nội dung như: 'Chúng tôi nhớ bạn!', kèm theo **ưu đãi đặc biệt có thời hạn** (ví dụ: mã giảm giá lớn cho lần mua tiếp theo, sản phẩm dùng thử miễn phí). Có thể gửi một khảo sát ngắn để tìm hiểu lý do họ không quay lại và đưa ra giải pháp phù hợp. Sử dụng dữ liệu về sở thích trước đây để gợi ý sản phẩm phù hợp."
                }
            ]
        },
        "26-50%": {
            "rate": "Ổn, nên cá nhân hóa nhiều hơn",
            "suggest": [
                {
                    "title": "Đề xuất sản phẩm/dịch vụ liên quan và bổ trợ dựa trên lịch sử mua hàng",
                    "details": "Sử dụng **thuật toán gợi ý thông minh** trên website hoặc qua email để đề xuất các sản phẩm/dịch vụ mà khách hàng có khả năng quan tâm dựa trên lịch sử mua sắm và hành vi duyệt web của họ. Không chỉ dừng lại ở 'Sản phẩm tương tự', hãy gợi ý các **sản phẩm bổ trợ** (ví dụ: mua điện thoại gợi ý ốp lưng, tai nghe) hoặc các **gói combo ưu đãi** có lợi cho khách hàng. Mục tiêu là tăng giá trị đơn hàng trung bình và duy trì sự quan tâm của họ."
                },
                {
                    "title": "Cá nhân hóa nội dung thông tin và giáo dục theo sở thích khách hàng",
                    "details": "Ngoài việc gợi ý sản phẩm, hãy cung cấp các **nội dung giá trị** (bài viết blog, video hướng dẫn, ebook, webinar) được **cá nhân hóa theo sở thích và vấn đề họ đang gặp phải**. Ví dụ: nếu khách hàng quan tâm đến chăm sóc da, gửi các bài viết về các bước skincare, thành phần hiệu quả, hoặc mẹo chăm sóc da theo mùa. Điều này giúp xây dựng mối quan hệ và định vị thương hiệu của bạn như một chuyên gia trong lĩnh vực đó."
                },
                {
                    "title": "Tạo các trải nghiệm cá nhân hóa bất ngờ (Surprise & Delight)",
                    "details": "Thỉnh thoảng, hãy dành tặng những **món quà nhỏ không báo trước** hoặc **ưu đãi bất ngờ** cho khách hàng mà không cần điều kiện gì. Ví dụ: một voucher nhỏ ngẫu nhiên, một sản phẩm dùng thử kèm theo đơn hàng, hoặc một lời cảm ơn viết tay. Những hành động này tuy nhỏ nhưng tạo ra ấn tượng mạnh mẽ, khiến khách hàng cảm thấy được trân trọng và tạo yếu tố 'WOW'."
                }
            ]
        },
        "51-75%": {
            "rate": "Tốt, triển khai loyalty sâu hơn",
            "suggest": [
                {
                    "title": "Thiết lập các mốc thưởng rõ ràng và hấp dẫn trong chương trình Loyalty",
                    "details": "Chương trình tích điểm cần có các **mốc thưởng cụ thể và dễ hình dung**, ví dụ: 'Đạt 500 điểm nhận voucher 50K', 'Đạt 1000 điểm nhận quà tặng đặc biệt', 'Đạt 2000 điểm miễn phí vận chuyển trọn đời'. Đảm bảo **giá trị của phần thưởng tăng dần** theo các mốc, và các phần thưởng ở mốc cao phải đủ hấp dẫn để thúc đẩy khách hàng đạt được. Thường xuyên **cập nhật danh mục quà tặng** để tránh nhàm chán."
                },
                {
                    "title": "Tạo điều kiện để khách hàng dễ dàng theo dõi và quản lý điểm/ưu đãi",
                    "details": "Phát triển một **dashboard cá nhân trên website/ứng dụng** nơi khách hàng có thể dễ dàng xem số điểm hiện có, lịch sử tích điểm, các ưu đãi đang có và thời hạn sử dụng. Gửi **thông báo định kỳ** (email/tin nhắn) về số điểm còn lại và các ưu đãi sắp hết hạn để nhắc nhở và khuyến khích họ sử dụng. Quy trình đổi điểm phải **đơn giản và nhanh chóng**."
                },
                {
                    "title": "Cung cấp ưu đãi 'mua trước, giảm giá sâu hơn' hoặc 'ưu đãi theo combo'",
                    "details": "Đặc biệt khuyến khích khách hàng trung thành mua hàng với số lượng lớn hơn hoặc các gói sản phẩm. Ví dụ: 'Mua 2 tặng 1', 'Giảm X% khi mua combo sản phẩm A + B'. Hoặc cung cấp **ưu đãi giá đặc biệt khi mua lại cùng một sản phẩm** trong một khoảng thời gian nhất định, khuyến khích sự gắn bó lặp lại. Đây là cách tăng giá trị đơn hàng và tần suất mua hàng."
                }
            ]
        },
        "76-100%": {
            "rate": "Tốt, thể hiện khả năng giữ chân cao — nên xây hệ thống xếp hạng/hội viên",
            "suggest": [
                {
                    "title": "Xây dựng hệ thống hạng thành viên với quyền lợi độc quyền và giá trị cao",
                    "details": "Phân chia khách hàng thành các hạng (ví dụ: **Thành viên Bạc, Vàng, Kim cương, Bạch kim**) dựa trên tổng chi tiêu hoặc số lượng giao dịch. Mỗi hạng cần có **các đặc quyền riêng biệt và tăng dần về giá trị**. Ví dụ: Thành viên Kim cương có quyền ưu tiên hỗ trợ 24/7, được tặng quà sinh nhật giá trị lớn, miễn phí đổi trả hàng không giới hạn, hoặc mời tham gia các buổi thử nghiệm sản phẩm độc quyền trước công chúng. Quyền lợi càng độc đáo, càng khuyến khích khách hàng phấn đấu lên hạng cao hơn."
                },
                {
                    "title": "Tạo các sự kiện tri ân và trải nghiệm cao cấp dành riêng cho từng hạng thành viên",
                    "details": "Đối với các hạng thành viên cao cấp, tổ chức các **sự kiện đặc biệt**: ví dụ: buổi tiệc trà thân mật, buổi workshop chuyên sâu với chuyên gia, đêm ra mắt sản phẩm VIP, hoặc thậm chí là một chuyến đi trải nghiệm ngắn. Những sự kiện này không chỉ là tri ân mà còn là cơ hội để khách hàng cảm thấy mình thuộc về một cộng đồng đặc biệt, được kết nối với thương hiệu và những khách hàng cùng đẳng cấp. Mục tiêu là tạo ra những **kỷ niệm đáng nhớ** thay vì chỉ ưu đãi tiền mặt."
                },
                {
                    "title": "Thiết lập cơ chế 'Thăng hạng nhanh' và 'Duy trì hạng' rõ ràng",
                    "details": "Ngoài các tiêu chí lên hạng thông thường, hãy tạo thêm các **cơ chế 'thăng hạng nhanh'** cho những khách hàng có đột biến về chi tiêu hoặc giới thiệu được nhiều người. Đồng thời, cần có **cơ chế 'duy trì hạng'** rõ ràng để khuyến khích khách hàng tiếp tục mua sắm và tương tác. Ví dụ: 'Để duy trì hạng Vàng, quý khách cần chi tiêu thêm X trong 6 tháng tới'. Giao tiếp các quy tắc này một cách minh bạch để khách hàng chủ động hơn trong việc tích lũy và duy trì quyền lợi."
                },
                {
                    "title": "Mời khách hàng hạng cao tham gia vào các hoạt động phát triển sản phẩm/dịch vụ",
                    "details": "Cho khách hàng hạng cao nhất cơ hội **đóng góp ý kiến trực tiếp vào quá trình phát triển sản phẩm hoặc cải tiến dịch vụ**. Điều này có thể thông qua các buổi họp nhóm tập trung (focus group), khảo sát chuyên sâu, hoặc mời họ dùng thử phiên bản beta của sản phẩm mới. Sự tham gia này không chỉ giúp bạn có được những phản hồi giá trị mà còn khiến khách hàng cảm thấy mình là một phần quan trọng của thương hiệu, tăng cường sự gắn kết và lòng trung thành tuyệt đối."
                }
            ]
        }
    },
    "Potential Loyalist": {
        "0-25%": {
            "rate": "Nên nurture thêm",
            "suggest": [
                {
                    "title": "Tạo chiến dịch nurture (nuôi dưỡng) với ưu đãi nhẹ và nội dung giáo dục",
                    "details": "Thiết lập chuỗi email tự động hoặc tin nhắn (nurture sequence) hướng đến việc **giáo dục khách hàng về giá trị sản phẩm/dịch vụ** của bạn. Các email nên bao gồm **nội dung hữu ích** (ví dụ: mẹo sử dụng sản phẩm, hướng dẫn giải quyết vấn đề khách hàng thường gặp, câu chuyện thành công của người dùng khác) kết hợp với **ưu đãi nhẹ** (giảm giá 5-10% hoặc miễn phí vận chuyển cho lần mua tiếp theo) để khuyến khích hành vi mua sắm. Tập trung vào việc **xây dựng lòng tin và sự hiểu biết** trước khi thúc đẩy bán hàng trực tiếp."
                },
                {
                    "title": "Cung cấp nội dung chứng thực xã hội (Social Proof)",
                    "details": "Lồng ghép các yếu tố chứng thực xã hội vào các thông điệp và kênh tiếp thị của bạn. Điều này bao gồm việc **hiển thị rõ ràng các đánh giá, nhận xét tích cực** từ khách hàng hiện tại, **số liệu về số lượng người đã sử dụng sản phẩm/dịch vụ**, hoặc **các giải thưởng, chứng nhận** mà doanh nghiệp đã đạt được. Mục tiêu là tạo dựng niềm tin và sự an tâm cho khách hàng tiềm năng, cho họ thấy rằng nhiều người khác đã tin tưởng và hài lòng."
                },
                {
                    "title": "Tối ưu hóa trải nghiệm khách hàng ở lần mua đầu tiên",
                    "details": "Đảm bảo rằng **lần đầu tiên khách hàng tương tác hoặc mua hàng diễn ra suôn sẻ và tích cực**. Điều này bao gồm quy trình đặt hàng dễ dàng, thông tin sản phẩm rõ ràng, dịch vụ giao hàng nhanh chóng và chính xác. Sau khi mua hàng, gửi email xác nhận với thông tin chi tiết, hướng dẫn sử dụng cơ bản và thông tin liên hệ hỗ trợ. Một trải nghiệm mua hàng đầu tiên tốt sẽ tạo tiền đề vững chắc cho các giao dịch tiếp theo."
                }
            ]
        },
        "26-50%": {
            "rate": "Có tiềm năng — cần thúc đẩy hành vi trung thành",
            "suggest": [
                {
                    "title": "Khuyến khích đăng ký tài khoản và hoàn thành hồ sơ khách hàng",
                    "details": "Tạo động lực để khách hàng **đăng ký tài khoản trên website/ứng dụng** và **hoàn thành hồ sơ cá nhân** (thông tin sinh nhật, sở thích, v.v.). Có thể tặng điểm thưởng, mã giảm giá nhỏ hoặc quyền truy cập nội dung độc quyền khi họ đăng ký/hoàn thành hồ sơ. Dữ liệu thu thập được sẽ giúp bạn cá nhân hóa trải nghiệm sau này. Đồng thời, một tài khoản cố định giúp họ dễ dàng theo dõi lịch sử mua hàng và quản lý ưu đãi."
                },
                {
                    "title": "Khuyến khích đánh giá sản phẩm và cung cấp phản hồi chi tiết",
                    "details": "Sau mỗi giao dịch, **chủ động gửi lời mời đánh giá sản phẩm** thông qua email hoặc tin nhắn. Cung cấp **ưu đãi nhỏ** (ví dụ: giảm giá cho lần mua tiếp theo, điểm thưởng) cho những khách hàng chịu khó viết đánh giá chất lượng. Khuyến khích họ chia sẻ kinh nghiệm sử dụng và cảm nhận cá nhân. Các đánh giá này không chỉ giúp bạn hiểu khách hàng mà còn là **social proof** tuyệt vời cho những khách hàng tiềm năng khác."
                },
                {
                    "title": "Đề xuất tham gia chương trình khách hàng thân thiết (nếu có)",
                    "details": "Giao tiếp rõ ràng về **lợi ích của việc trở thành thành viên chương trình khách hàng thân thiết** (ví dụ: tích điểm, ưu đãi độc quyền, quà tặng). Tạo các **lời kêu gọi hành động (CTA) nổi bật** để khuyến khích họ đăng ký. Có thể tặng **điểm chào mừng** hoặc **ưu đãi đặc biệt cho lần đầu tham gia** để thu hút họ bước vào hành trình trung thành."
                }
            ]
        },
        "51-75%": {
            "rate": "Đang chuyển đổi tốt, cần cá nhân hóa",
            "suggest": [
                {
                    "title": "Cá nhân hóa sâu hơn các thông điệp và ưu đãi dựa trên dữ liệu hành vi",
                    "details": "Sử dụng dữ liệu về **lịch sử mua hàng, sản phẩm đã xem, thời gian truy cập, và phản hồi** để tạo ra các thông điệp và ưu đãi được **cá nhân hóa cực độ**. Ví dụ: gửi email về sản phẩm mà họ đã bỏ vào giỏ hàng nhưng chưa mua, hoặc cung cấp mã giảm giá cho danh mục sản phẩm họ thường xuyên quan tâm. Đảm bảo mọi giao tiếp đều có tên của họ và liên quan trực tiếp đến nhu cầu của họ."
                },
                {
                    "title": "Thúc đẩy các chương trình giới thiệu bạn bè (Referral Programs) với thưởng rõ ràng",
                    "details": "Khi khách hàng đã có sự gắn kết nhất định, hãy **khuyến khích họ giới thiệu bạn bè**. Thiết kế một chương trình referral hấp dẫn, nơi **cả người giới thiệu và người được giới thiệu đều nhận được lợi ích** (ví dụ: người giới thiệu nhận X% hoa hồng hoặc voucher, người được giới thiệu nhận Y% giảm giá cho đơn hàng đầu tiên). Quảng bá chương trình này thông qua email, website, và mạng xã hội. Đảm bảo quy trình giới thiệu và nhận thưởng dễ dàng."
                },
                {
                    "title": "Cung cấp mã giảm giá cá nhân hóa theo dịp và sở thích",
                    "details": "Ngoài sinh nhật, hãy tạo ra các **mã giảm giá cá nhân hóa cho các dịp đặc biệt khác** liên quan đến khách hàng (ví dụ: ngày kỷ niệm lần mua hàng đầu tiên, ngày kỷ niệm tham gia chương trình thành viên). Mức giảm giá có thể cao hơn một chút so với các phân khúc trước. Hơn nữa, mã giảm giá nên tập trung vào các sản phẩm hoặc dịch vụ mà họ có khả năng mua, dựa trên hành vi và sở thích đã được phân tích."
                }
            ]
        },
        "76-100%": {
            "rate": "Rất tốt, cần duy trì & phát triển dài hạn",
            "suggest": [
                {
                    "title": "Tổ chức các buổi gặp mặt hoặc sự kiện tri ân riêng cho nhóm này",
                    "details": "Thay vì chỉ ưu đãi, hãy tạo ra các **trải nghiệm độc quyền**. Tổ chức các buổi **offline gặp mặt thân mật**, **workshop chuyên đề**, hoặc **buổi giới thiệu sản phẩm mới sớm** chỉ dành riêng cho nhóm khách hàng này. Đây là cơ hội để họ gặp gỡ đội ngũ của bạn, giao lưu với những khách hàng cùng sở thích, và cảm thấy mình là một phần của cộng đồng đặc biệt. Mục tiêu là xây dựng mối quan hệ cá nhân sâu sắc hơn."
                },
                {
                    "title": "Cung cấp các lợi ích đặc quyền mang tính cá nhân hóa cao",
                    "details": "Bên cạnh các ưu đãi giảm giá, hãy cung cấp các **lợi ích vượt trội**: **ưu tiên hỗ trợ khách hàng** (đường dây nóng riêng, quản lý tài khoản cá nhân), **miễn phí vận chuyển trọn đời** (nếu phù hợp), **quà tặng độc quyền không bán ra thị trường**, hoặc **quyền truy cập sớm vào phiên bản beta của sản phẩm/dịch vụ mới**. Những lợi ích này phải tạo cảm giác được ưu tiên và khác biệt rõ rệt so với các phân khúc khác."
                },
                {
                    "title": "Mời tham gia các khảo sát chuyên sâu hoặc nhóm thử nghiệm sản phẩm",
                    "details": "Khi có sản phẩm hoặc tính năng mới, hãy **mời nhóm khách hàng này tham gia vào các khảo sát chuyên sâu hoặc các nhóm thử nghiệm**. Điều này không chỉ giúp bạn thu thập phản hồi chất lượng cao mà còn khiến khách hàng cảm thấy ý kiến của họ được trân trọng và có ảnh hưởng đến sự phát triển của thương hiệu. Có thể tặng quà tri ân cho sự đóng góp của họ."
                },
                {
                    "title": "Xây dựng kênh giao tiếp trực tiếp và cá nhân hóa với quản lý cấp cao (tùy ngành)",
                    "details": "Đối với một số khách hàng có giá trị rất cao trong nhóm này, hãy xem xét việc **thiết lập kênh liên lạc trực tiếp với quản lý cấp cao** (ví dụ: CEO hoặc trưởng phòng sản phẩm/dịch vụ). Điều này thể hiện sự trân trọng đặc biệt và giúp giải quyết mọi vấn đề một cách nhanh chóng, đồng thời thu thập được những insight giá trị từ những người dùng tích cực nhất."
                }
            ]
        }
    },
    "New Customers": {
        "0-25%": {
            "rate": "Bình thường",
            "suggest": [
                {
                    "title": "Gửi email cảm ơn và hướng dẫn sử dụng sản phẩm chi tiết",
                    "details": "Ngay sau khi mua hàng, gửi một **email cảm ơn cá nhân hóa**. Kèm theo trong email là **hướng dẫn sử dụng sản phẩm chi tiết** (có thể là video hướng dẫn, infographic, hoặc tài liệu PDF dễ đọc) để giúp khách hàng bắt đầu sử dụng sản phẩm một cách dễ dàng và hiệu quả. Đảm bảo thông tin liên hệ hỗ trợ khách hàng được hiển thị rõ ràng để họ có thể liên hệ nếu cần."
                },
                {
                    "title": "Tạo chuỗi email onboarding rõ ràng và giải thích chính sách",
                    "details": "Thiết lập một **chuỗi email onboarding tự động** (1-3 email) trong vài ngày đầu tiên. Email đầu tiên tập trung vào việc **xác nhận đơn hàng và cảm ơn**. Email tiếp theo có thể **giới thiệu các tính năng nổi bật của sản phẩm** hoặc **cách tận dụng tối đa giá trị từ dịch vụ**. Đồng thời, **giải thích rõ ràng các chính sách quan trọng** như đổi trả, bảo hành, và giao hàng để xây dựng niềm tin và loại bỏ mọi lo ngại ban đầu."
                },
                {
                    "title": "Cung cấp kênh hỗ trợ tức thì và dễ tiếp cận",
                    "details": "Đảm bảo khách hàng mới có thể dễ dàng tìm thấy và sử dụng các kênh hỗ trợ khi cần. Điều này bao gồm **tích hợp live chat** trên website, cung cấp **số điện thoại hotline rõ ràng**, và **địa chỉ email hỗ trợ chuyên dụng**. Phản hồi nhanh chóng và chuyên nghiệp trong lần liên hệ đầu tiên sẽ tạo ấn tượng tích cực và giúp họ cảm thấy được quan tâm."
                }
            ]
        },
        "26-50%": {
            "rate": "Ổn, cần push email/series giới thiệu",
            "suggest": [
                {
                    "title": "Cung cấp mã giảm giá cho lần mua tiếp theo",
                    "details": "Trong email cảm ơn hoặc một email theo dõi sau đó, hãy **tặng một mã giảm giá nhỏ** (ví dụ: 5-10% hoặc miễn phí vận chuyển) cho lần mua hàng tiếp theo. Mã giảm giá này nên có **thời hạn sử dụng nhất định** để tạo cảm giác cấp bách và khuyến khích họ quay lại sớm."
                },
                {
                    "title": "Gửi chuỗi email giới thiệu sản phẩm bán chạy và nhận xét của người mua cũ",
                    "details": "Phát triển một **chuỗi email marketing** (ví dụ: 2-3 email trong vòng 1-2 tuần sau mua hàng đầu tiên) tập trung vào việc **giới thiệu các sản phẩm bán chạy nhất** hoặc **sản phẩm có liên quan** đến mặt hàng họ vừa mua. Lồng ghép **các đánh giá, nhận xét tích cực từ những khách hàng cũ** (social proof) để tăng độ tin cậy và khơi gợi sự quan tâm. Mục tiêu là mở rộng danh mục sản phẩm mà họ quan tâm."
                },
                {
                    "title": "Khuyến khích tương tác trên mạng xã hội và cộng đồng",
                    "details": "Mời khách hàng mới **theo dõi các kênh mạng xã hội** của doanh nghiệp (Facebook, Instagram, TikTok...). Đây là nơi họ có thể cập nhật thông tin, xem các nội dung hấp dẫn, và bắt đầu cảm thấy mình là một phần của cộng đồng. Đôi khi có thể tổ chức các **minigame hoặc GIVEAWAY nhỏ** dành cho người theo dõi mới để tăng tương tác."
                }
            ]
        },
        "51-75%": {
            "rate": "Có dấu hiệu thích sản phẩm — nên upsell nhanh",
            "suggest": [
                {
                    "title": "Mời tham gia cộng đồng khách hàng để tăng gắn kết và tương tác",
                    "details": "Với những khách hàng có dấu hiệu thích sản phẩm (ví dụ: đã mua hơn 1 lần, hoặc tương tác cao với email), hãy **chủ động mời họ tham gia các nhóm cộng đồng riêng tư** (như nhóm Facebook/Zalo của khách hàng). Đây là nơi họ có thể đặt câu hỏi, chia sẻ kinh nghiệm, và nhận được hỗ trợ từ cả cộng đồng và từ đội ngũ của bạn. Điều này giúp xây dựng mối quan hệ bền chặt hơn và tăng cường lòng trung thành."
                },
                {
                    "title": "Đẩy mạnh chiến lược upsell/cross-sell thông qua email và phiếu giảm giá",
                    "details": "Gửi các **email upsell và cross-sell cá nhân hóa** dựa trên lịch sử mua hàng của họ. Ví dụ: nếu họ mua điện thoại, gợi ý tai nghe, ốp lưng, hoặc dịch vụ bảo hành mở rộng. Kèm theo các đề xuất này là **phiếu giảm giá hấp dẫn** (ví dụ: giảm X% khi mua kèm sản phẩm Y, hoặc giảm giá cho đơn hàng tiếp theo khi mua combo). Sử dụng ngôn ngữ khuyến khích sự cấp bách và lợi ích khi mua kèm."
                },
                {
                    "title": "Cung cấp nội dung chuyên sâu và giá trị gia tăng",
                    "details": "Ngoài việc bán hàng, hãy gửi các **nội dung mang lại giá trị thực sự** cho khách hàng, giúp họ khai thác tối đa sản phẩm đã mua hoặc giải quyết các vấn đề liên quan. Ví dụ: hướng dẫn sử dụng nâng cao, mẹo bảo quản sản phẩm, các ý tưởng sáng tạo với sản phẩm. Điều này định vị bạn như một đối tác đáng tin cậy, không chỉ là người bán hàng."
                }
            ]
        },
        "76-100%": {
            "rate": "Tốt, cần gấp rút chuyển hóa sang nhóm trung thành",
            "suggest": [
                {
                    "title": "Giới thiệu các sản phẩm/dịch vụ liên quan kèm ưu đãi combo hấp dẫn",
                    "details": "Dựa trên hành vi mua sắm và tương tác, hãy **xây dựng các gói combo sản phẩm/dịch vụ liên quan** với mức giá ưu đãi đặc biệt. Ví dụ: 'Mua bộ sản phẩm A kèm gói dịch vụ B chỉ với X đồng'. Quảng bá các combo này thông qua email, tin nhắn, và banner trên website. Mục tiêu là khuyến khích khách hàng thử thêm các sản phẩm/dịch vụ khác của bạn và tăng giá trị trọn đời của họ."
                },
                {
                    "title": "Tối ưu hóa hành trình chuyển đổi từ lần đầu mua đến trung thành",
                    "details": "Nghiên cứu và **phân tích kỹ lưỡng dữ liệu** để hiểu rõ hành vi của nhóm khách hàng này: điều gì thúc đẩy họ mua hàng nhiều lần? Yếu tố nào khiến họ gắn bó? Từ đó, **xây dựng một lộ trình rõ ràng** để chuyển đổi họ thành khách hàng trung thành, bao gồm các điểm chạm và ưu đãi ở từng giai đoạn. Đảm bảo trải nghiệm mua sắm và tương tác luôn mượt mà, nhất quán và cá nhân hóa cao."
                },
                {
                    "title": "Đăng ký tự động hoặc mời tham gia Chương trình Khách hàng Thân thiết (Loyalty Program) ngay từ đầu",
                    "details": "Ngay khi khách hàng thể hiện mức độ gắn kết cao, hãy **tự động đăng ký họ vào chương trình khách hàng thân thiết** (nếu có) hoặc **gửi lời mời tham gia với ưu đãi chào mừng đặc biệt**. Giải thích rõ ràng các quyền lợi mà họ sẽ nhận được (điểm thưởng, xếp hạng thành viên, ưu đãi độc quyền). Điều này giúp họ ngay lập tức cảm thấy được công nhận và có động lực để tích lũy điểm/lên hạng."
                },
                {
                    "title": "Cung cấp quyền lợi 'khách hàng tiềm năng trung thành' độc quyền",
                    "details": "Dành tặng một số **quyền lợi đặc biệt chỉ cho nhóm này** để họ cảm thấy mình đang trên con đường trở thành khách hàng trung thành. Ví dụ: quyền truy cập sớm vào một số chương trình khuyến mãi sắp tới, một buổi tư vấn miễn phí với chuyên gia (nếu phù hợp với ngành), hoặc một món quà tri ân nhỏ thể hiện sự mong muốn được đồng hành lâu dài."
                }
            ]
        }
    },
    "Promising": {
        "0-25%": {
            "rate": "Thấp — cần chăm sóc để không bị “lụi tàn”",
            "suggest": [
                {
                    "title": "Giới thiệu sản phẩm nổi bật và lợi ích cốt lõi qua chuỗi email",
                    "details": "Thiết lập một chuỗi email tự động tập trung vào việc **giới thiệu các sản phẩm/dịch vụ bán chạy nhất và làm nổi bật những lợi ích cốt lõi** mà chúng mang lại. Mỗi email nên tập trung vào một hoặc hai lợi ích chính, kèm theo **hình ảnh/video hấp dẫn** và **lời kêu gọi hành động (CTA) rõ ràng**. Mục tiêu là giúp khách hàng tiềm năng nhận ra giá trị và sự phù hợp của sản phẩm với nhu cầu của họ."
                },
                {
                    "title": "Gửi email gợi ý mua hàng tiếp theo và sản phẩm liên quan",
                    "details": "Dựa trên dữ liệu ít ỏi hiện có (nếu có, ví dụ: sản phẩm họ đã xem nhưng chưa mua, hoặc chỉ mua 1 lần duy nhất), gửi các **email gợi ý mua hàng tiếp theo** hoặc **sản phẩm liên quan/bổ trợ**. Ví dụ: 'Bạn có thể thích...' hoặc 'Hoàn thiện trải nghiệm với...'. Tránh thúc ép quá mức, chỉ nên tập trung vào việc **tạo ra những gợi ý phù hợp và có giá trị**."
                },
                {
                    "title": "Cung cấp ưu đãi nhẹ cho lần mua tiếp theo kèm thời hạn",
                    "details": "Kèm theo các email gợi ý, hãy cung cấp một **ưu đãi nhỏ và có thời hạn** (ví dụ: giảm giá 5% hoặc miễn phí vận chuyển cho đơn hàng tiếp theo trong 7 ngày). Sự giới hạn về thời gian sẽ tạo động lực cho họ hành động. Đảm bảo ưu đãi đủ hấp dẫn để thúc đẩy quyết định mua hàng mà không làm mất đi giá trị của thương hiệu."
                }
            ]
        },
        "26-50%": {
            "rate": "Có động lực nếu push nhẹ",
            "suggest": [
                {
                    "title": "Tạo chiến dịch upsell hoặc bundle khuyến mãi nhẹ",
                    "details": "Dựa trên sản phẩm họ đã mua hoặc quan tâm, hãy thiết kế các **chiến dịch upsell (nâng cấp sản phẩm) hoặc bundle (gói sản phẩm) với mức khuyến mãi nhẹ**. Ví dụ: 'Nâng cấp lên phiên bản cao cấp để nhận thêm tính năng X và giảm giá Y%', hoặc 'Mua combo sản phẩm A và B để tiết kiệm Z%'. Giao tiếp rõ ràng về **lợi ích tăng thêm** khi khách hàng chi tiêu nhiều hơn."
                },
                {
                    "title": "Tặng ưu đãi nhỏ nếu mua lần 2 trong thời gian ngắn",
                    "details": "Thiết lập một cơ chế tặng thưởng cho khách hàng nếu họ thực hiện **lần mua thứ hai trong một khung thời gian ngắn nhất định** (ví dụ: 7 hoặc 14 ngày sau lần mua đầu tiên). Ưu đãi này có thể là một mã giảm giá nhỏ, một sản phẩm dùng thử miễn phí, hoặc điểm thưởng nhân đôi. Điều này khuyến khích hành vi mua lặp lại sớm và củng cố thói quen mua hàng."
                },
                {
                    "title": "Sử dụng Retargeting Ads cá nhân hóa",
                    "details": "Triển khai các **chiến dịch quảng cáo retargeting (tiếp thị lại) trên các nền tảng mạng xã hội hoặc website** nhắm mục tiêu vào những khách hàng trong nhóm này. Quảng cáo nên hiển thị các sản phẩm họ đã xem, sản phẩm liên quan, hoặc các ưu đãi đặc biệt để nhắc nhở và khuyến khích họ quay lại hoàn tất giao dịch hoặc mua thêm. Cá nhân hóa nội dung quảng cáo càng cao càng tốt."
                }
            ]
        },
        "51-75%": {
            "rate": "Có thể upsell, tạo tương tác nhanh",
            "suggest": [
                {
                    "title": "Mời tham gia sự kiện/livestream giới thiệu sản phẩm hoặc hội thảo",
                    "details": "Chủ động mời nhóm khách hàng này tham gia các **sự kiện trực tuyến (livestream, webinar) hoặc ngoại tuyến (nếu có)** nơi bạn giới thiệu sản phẩm mới, hướng dẫn sử dụng chuyên sâu, hoặc chia sẻ kiến thức liên quan đến ngành. Điều này giúp tăng cường sự gắn kết, tạo cơ hội cho họ đặt câu hỏi trực tiếp và cảm thấy mình là một phần của cộng đồng, đồng thời tạo cơ hội upsell/cross-sell trong quá trình."
                },
                {
                    "title": "Mời tham gia minigame tặng quà để tăng tương tác và thu thập thông tin",
                    "details": "Tổ chức các **minigame hoặc GIVEAWAY nhỏ** trên các kênh mạng xã hội hoặc qua email, dành riêng cho nhóm này. Các minigame này có thể yêu cầu họ chia sẻ cảm nghĩ về sản phẩm, trả lời câu hỏi liên quan, hoặc giới thiệu bạn bè. Đây là cách thú vị để **tăng tương tác**, **thu thập thêm dữ liệu về sở thích** của họ, và **tạo cảm giác được tặng quà**."
                },
                {
                    "title": "Cung cấp ưu đãi độc quyền cho các sản phẩm/dịch vụ cao cấp hơn",
                    "details": "Dựa trên mức độ quan tâm đã thể hiện, hãy gửi các **ưu đãi độc quyền** cho những sản phẩm/dịch vụ có giá trị cao hơn mà họ có thể chưa cân nhắc. Mức ưu đãi cần đủ hấp dẫn để khuyến khích họ 'lên đời'. Ví dụ: 'Ưu đãi đặc biệt khi nâng cấp gói dịch vụ từ cơ bản lên cao cấp, chỉ dành cho bạn!'"
                }
            ]
        },
        "76-100%": {
            "rate": "Tốt, đang sẵn sàng nâng cấp lên Loyalist hoặc Champion",
            "suggest": [
                {
                    "title": "Khuyến khích theo dõi kênh social và tham gia các hoạt động cộng đồng",
                    "details": "Tăng cường lời kêu gọi khách hàng **theo dõi và tương tác trên tất cả các kênh mạng xã hội** của bạn. Tổ chức các **buổi hỏi đáp trực tiếp (AMA)**, **thăm dò ý kiến**, hoặc **cuộc thi nhỏ** trên social media để khuyến khích họ tham gia và chia sẻ quan điểm. Điều này giúp họ cảm thấy mình là một phần của cộng đồng năng động và có ảnh hưởng."
                },
                {
                    "title": "Ưu tiên upsell/cross-sell theo lịch sử sản phẩm đã mua và hành vi duyệt web",
                    "details": "Sử dụng **phân tích dữ liệu nâng cao** để xác định các sản phẩm/dịch vụ mà nhóm này có khả năng mua tiếp theo hoặc nâng cấp. Đẩy mạnh các chiến dịch **upsell và cross-sell cực kỳ cá nhân hóa**, không chỉ dựa vào lịch sử mua hàng mà còn cả hành vi duyệt web, thời gian sử dụng sản phẩm. Ví dụ: gợi ý phụ kiện cao cấp cho sản phẩm họ đang dùng, hoặc các khóa học chuyên sâu nếu họ đã mua tài liệu cơ bản."
                },
                {
                    "title": "Đề xuất tham gia Chương trình Khách hàng Thân thiết (Loyalty Program) với ưu đãi hấp dẫn",
                    "details": "Đây là thời điểm lý tưởng để **chủ động mời họ gia nhập chương trình loyalty** của bạn. Giao tiếp rõ ràng về các **lợi ích ngay lập tức** khi tham gia (điểm thưởng chào mừng, ưu đãi dành riêng cho thành viên mới) và **lộ trình phát triển thành các hạng thành viên cao hơn** (Loyalist, Champion) với các đặc quyền hấp dẫn hơn. Hãy làm cho việc đăng ký trở nên dễ dàng và hấp dẫn."
                },
                {
                    "title": "Gửi các nội dung độc quyền hoặc thông tin 'nhá hàng' sản phẩm mới",
                    "details": "Để củng cố mối quan hệ, hãy gửi các **nội dung độc quyền** (ví dụ: bản tin nội bộ, nghiên cứu thị trường nhỏ, phỏng vấn chuyên gia) hoặc **thông tin 'nhá hàng' (sneak peek)** về các sản phẩm/dịch vụ sắp ra mắt. Điều này tạo cảm giác được ưu tiên và tin tưởng, khuyến khích họ tiếp tục theo dõi và chờ đợi những điều mới mẻ từ thương hiệu."
                }
            ]
        }
    },
    "Need Attention": {
        "0-25%": {
            "rate": "An toàn — chỉ cần giữ nhịp độ nội dung gợi nhắc",
            "suggest": [
                {
                    "title": "Gửi survey ngắn để thu thập lý do giảm tương tác một cách tế nhị",
                    "details": "Thiết kế một **khảo sát ngắn gọn (2-3 câu hỏi)** và **không quá xâm phạm riêng tư** để tìm hiểu lý do khách hàng giảm tương tác. Các câu hỏi có thể là: 'Bạn có gặp vấn đề gì khi sử dụng sản phẩm/dịch vụ của chúng tôi không?', 'Bạn có cảm thấy nội dung chúng tôi gửi chưa phù hợp không?', 'Có điều gì chúng tôi có thể cải thiện không?'. Gửi khảo sát này qua email hoặc tin nhắn, có thể kèm theo một **ưu đãi nhỏ** (ví dụ: 10 điểm tích lũy) để khuyến khích họ phản hồi. **Lắng nghe và phân tích phản hồi** để điều chỉnh chiến lược."
                },
                {
                    "title": "Gửi nhắc nhở (reminder) với gợi ý sản phẩm dựa trên hành vi đã có",
                    "details": "Dựa trên **lịch sử mua hàng hoặc hành vi duyệt web gần đây nhất** của khách hàng, gửi các email/tin nhắn nhắc nhở nhẹ nhàng. Ví dụ: 'Sản phẩm X bạn đã xem đang có ưu đãi', 'Chúng tôi có các sản phẩm bổ sung cho Y mà bạn đã mua', hoặc 'Bạn đã lâu không ghé thăm, chúng tôi có sản phẩm Z có thể bạn quan tâm'. Kèm theo các gợi ý là **hình ảnh hấp dẫn và lợi ích rõ ràng** của sản phẩm, nhưng **không quá thúc ép**. Mục tiêu là giữ cho thương hiệu luôn hiện diện trong tâm trí họ."
                },
                {
                    "title": "Cung cấp nội dung giá trị và thông tin cập nhật liên tục",
                    "details": "Duy trì tần suất gửi các **bản tin hoặc email chứa nội dung có giá trị**, không chỉ tập trung vào bán hàng. Điều này có thể là các bài viết blog mới, video hướng dẫn, mẹo sử dụng sản phẩm, hoặc thông tin cập nhật về các xu hướng trong ngành. Mục tiêu là để khách hàng nhìn thấy bạn là nguồn cung cấp thông tin hữu ích, không chỉ là nơi mua sắm, từ đó duy trì sự kết nối và quan tâm."
                }
            ]
        },
        "26-50%": {
            "rate": "Bắt đầu có dấu hiệu giảm tương tác",
            "suggest": [
                {
                    "title": "Tạo ưu đãi quay lại giới hạn thời gian (Flash Sale cá nhân hóa)",
                    "details": "Thiết kế một **ưu đãi hấp dẫn và có thời hạn cực ngắn** (ví dụ: Flash Sale 24h hoặc 48h) dành riêng cho từng khách hàng trong nhóm này. Ưu đãi này có thể là một **mã giảm giá sâu hơn** (ví dụ: 15-20%) cho một danh mục sản phẩm cụ thể mà họ đã quan tâm, hoặc **miễn phí vận chuyển cho mọi đơn hàng**. Thông báo ưu đãi qua email/tin nhắn với tiêu đề thu hút sự chú ý và nhấn mạnh tính khẩn cấp để kích thích hành động nhanh chóng."
                },
                {
                    "title": "Gửi mã giảm giá cá nhân hóa để kích thích tương tác trở lại",
                    "details": "Thay vì ưu đãi chung, hãy gửi một **mã giảm giá cá nhân hóa** với mức giảm hấp dẫn, có thể áp dụng cho bất kỳ sản phẩm nào hoặc danh mục sản phẩm mà họ đã từng mua/quan tâm. Kèm theo mã giảm giá là một thông điệp chân thành, bày tỏ mong muốn được phục vụ lại họ. Ví dụ: 'Chúng tôi nhớ bạn! Đây là món quà nhỏ để chào đón bạn quay trở lại'."
                },
                {
                    "title": "Sử dụng chiến dịch email nhắc nhở giỏ hàng bị bỏ quên (Abandoned Cart Reminders) với ưu đãi nhỏ",
                    "details": "Nếu khách hàng đã bỏ sản phẩm vào giỏ hàng nhưng không hoàn tất, hãy gửi **chuỗi email nhắc nhở giỏ hàng bị bỏ quên**. Email đầu tiên chỉ là lời nhắc nhở. Email thứ hai (nếu vẫn chưa mua) có thể kèm theo một **ưu đãi nhỏ** (ví dụ: miễn phí vận chuyển) để khuyến khích họ hoàn tất giao dịch. Cá nhân hóa nội dung email với hình ảnh và tên sản phẩm trong giỏ hàng."
                }
            ]
        },
        "51-75%": {
            "rate": "Đáng lưu ý, nên áp dụng retargeting",
            "suggest": [
                {
                    "title": "Đề xuất gói combo giá trị cao kèm quà tặng để tăng sức hấp dẫn",
                    "details": "Với khách hàng có dấu hiệu mất tương tác rõ ràng hơn, hãy đưa ra các **gói combo sản phẩm/dịch vụ có giá trị cao với mức giá ưu đãi đặc biệt**, kèm theo một **quà tặng giá trị** (không chỉ là giảm giá). Ví dụ: 'Mua combo A và B để nhận ngay sản phẩm C miễn phí và tiết kiệm X%'. Quảng bá gói combo này thông qua các kênh tiếp thị khác nhau, tập trung vào **lợi ích tổng thể** mà khách hàng nhận được."
                },
                {
                    "title": "Triển khai quảng cáo Retargeting và sử dụng kênh SMS song song email",
                    "details": "Tăng cường hiển thị quảng cáo đến nhóm khách hàng này thông qua **chiến dịch Retargeting trên các nền tảng mạng xã hội và Google Display Network**. Quảng cáo cần **cá nhân hóa cao** dựa trên hành vi duyệt web hoặc lịch sử mua hàng của họ. Song song đó, sử dụng **SMS marketing** để gửi các thông điệp ngắn gọn, trực tiếp về ưu đãi đặc biệt hoặc lời nhắc nhở quan trọng, đặc biệt hiệu quả khi khách hàng không mở email thường xuyên."
                },
                {
                    "title": "Tổ chức cuộc thi hoặc GIVEAWAY với giải thưởng hấp dẫn",
                    "details": "Tổ chức các cuộc thi hoặc GIVEAWAY trên mạng xã hội hoặc website với **giải thưởng có giá trị lớn** (ví dụ: sản phẩm chủ lực, voucher giá trị cao, trải nghiệm độc quyền). Yêu cầu họ tham gia bằng cách bình luận, chia sẻ, hoặc tag bạn bè. Điều này giúp **tái tạo sự hào hứng và tương tác** với thương hiệu, đồng thời lan tỏa thông điệp đến những khách hàng tiềm năng khác."
                }
            ]
        },
        "76-100%": {
            "rate": "Đáng báo động, cần chăm sóc cá nhân hoá nhiều hơn",
            "suggest": [
                {
                    "title": "Thực hiện remarketing bằng quảng cáo cá nhân hóa cực kỳ chi tiết",
                    "details": "Triển khai chiến dịch **remarketing (tiếp thị lại) với mức độ cá nhân hóa cao nhất**. Không chỉ hiển thị lại sản phẩm đã xem, mà còn tạo ra các quảng cáo với **thông điệp riêng biệt** dựa trên nguyên nhân khách hàng rời đi (nếu có thể xác định). Ví dụ: nếu họ bỏ giỏ hàng vì giá, quảng cáo có thể đưa ra ưu đãi đặc biệt. Sử dụng **hình ảnh và ngôn ngữ trực tiếp, gợi nhớ** về những trải nghiệm tích cực trước đây với thương hiệu."
                },
                {
                    "title": "Dùng CSKH chủ động gọi điện hoặc mời khảo sát để hiểu lý do giảm tương tác",
                    "details": "Đối với những khách hàng có giá trị cao hoặc có lịch sử mua sắm đáng kể, hãy để **đội ngũ Chăm sóc khách hàng (CSKH) chủ động gọi điện thoại** để hỏi thăm, tìm hiểu lý do họ không tương tác/mua hàng nữa. Cuộc gọi này không nhằm mục đích bán hàng mà là **lắng nghe và thể hiện sự quan tâm thực sự**. Hoặc mời họ tham gia một **buổi phỏng vấn/khảo sát sâu** (có thể qua video call) và tặng quà tri ân cho sự đóng góp của họ. Mục tiêu là hiểu rõ nguyên nhân cốt lõi và đưa ra giải pháp cá nhân."
                },
                {
                    "title": "Gửi ưu đãi 'quay lại' không thể từ chối và có giới hạn thời gian cực ngắn",
                    "details": "Cung cấp một **ưu đãi 'không thể từ chối'**, ví dụ: mã giảm giá cực lớn (ví dụ: 30-50%) hoặc sản phẩm miễn phí cho lần mua tiếp theo, kèm theo thời hạn sử dụng rất ngắn (24-48 giờ). Ưu đãi này phải được thiết kế để bù đắp bất kỳ rào cản nào khiến họ rời đi và tạo động lực mạnh mẽ để quay lại ngay lập tức. Gửi ưu đãi này qua nhiều kênh (email, SMS, pop-up trên website nếu họ truy cập)."
                },
                {
                    "title": "Tạo trải nghiệm 'được phục hồi' cá nhân hóa và đặc biệt",
                    "details": "Khi khách hàng quay lại, hãy tạo một **trải nghiệm 'được phục hồi' độc đáo**. Điều này có thể là một **lời chào mừng cá nhân hóa đặc biệt**, một **quà tặng nhỏ kèm theo đơn hàng đầu tiên**, hoặc một **tin nhắn cảm ơn chân thành từ quản lý**. Mục tiêu là khiến họ cảm thấy được trân trọng và xóa bỏ mọi ấn tượng tiêu cực trước đó, khuyến khích họ gắn bó lâu dài hơn."
                }
            ]
        }
    },
    "About To Sleep": {
        "0-25%": {
            "rate": "Ổn, chỉ cần khơi gợi nhẹ",
            "suggest": [
                {
                    "title": "Nhắc nhở nhẹ nhàng qua email về sản phẩm đã từng mua hoặc quan tâm",
                    "details": "Gửi một email nhắc nhở nhẹ nhàng, không mang tính thúc ép, về các sản phẩm mà khách hàng đã từng mua hoặc có dấu hiệu quan tâm (ví dụ: đã xem, thêm vào danh sách yêu thích). Email có thể sử dụng tiêu đề như: 'Bạn có nhớ X không?', hoặc 'Sản phẩm X vẫn đang chờ bạn'. Kèm theo là hình ảnh sản phẩm và một lời kêu gọi hành động (CTA) rõ ràng nhưng không quá gắt gao. Mục tiêu là gợi lại sự quan tâm mà không gây khó chịu."
                },
                {
                    "title": "Gửi nội dung khơi gợi sự quan tâm: sản phẩm mới, bài blog, hoặc tin tức",
                    "details": "Duy trì sự hiện diện trong hộp thư đến của khách hàng bằng cách gửi các email chứa nội dung có giá trị và không liên quan trực tiếp đến bán hàng. Điều này có thể bao gồm: giới thiệu các sản phẩm mới và nổi bật, chia sẻ các bài viết blog hữu ích, cập nhật tin tức về thương hiệu hoặc ngành. Mục tiêu là cung cấp giá trị thông tin, giữ cho thương hiệu luôn mới mẻ và thú vị trong tâm trí họ, dù họ chưa mua hàng ngay."
                },
                {
                    "title": "Cá nhân hóa các gợi ý dựa trên mùa vụ hoặc xu hướng",
                    "details": "Dựa trên thời gian trong năm hoặc các xu hướng hiện tại, gửi các gợi ý sản phẩm hoặc nội dung phù hợp. Ví dụ: gợi ý sản phẩm chống nắng vào mùa hè, hoặc các sản phẩm trang trí dịp lễ. Điều này giúp các thông điệp trở nên liên quan hơn và tăng khả năng thu hút sự chú ý của khách hàng."
                }
            ]
        },
        "26-50%": {
            "rate": "Cảnh báo nhẹ — nên có chiến dịch làm mới trải nghiệm",
            "suggest": [
                {
                    "title": "Gửi mã giảm giá có hạn sử dụng trong 24–48h để tạo tính cấp bách",
                    "details": "Để kích thích hành động nhanh chóng, gửi một mã giảm giá với **thời hạn sử dụng rất ngắn** (ví dụ: chỉ trong 24 hoặc 48 giờ). Mức giảm giá nên đủ hấp dẫn (ví dụ: 10-15% hoặc miễn phí vận chuyển) và được thông báo rõ ràng trong tiêu đề email hoặc tin nhắn để thu hút sự chú ý ngay lập tức. Đây là một chiến thuật hiệu quả để 'đánh thức' khách hàng đang có dấu hiệu ngủ quên."
                },
                {
                    "title": "Mời dùng thử sản phẩm mới kèm ưu đãi nhẹ",
                    "details": "Nếu doanh nghiệp có sản phẩm hoặc dịch vụ mới ra mắt, hãy mời nhóm khách hàng này dùng thử với một **ưu đãi giới thiệu nhẹ nhàng**. Điều này không chỉ giúp khách hàng khám phá những gì mới mẻ mà thương hiệu cung cấp mà còn tạo cảm giác được ưu tiên, khơi gợi lại sự tò mò và hứng thú của họ."
                },
                {
                    "title": "Cá nhân hóa thông điệp dựa trên lý do tiềm năng khiến họ giảm tương tác",
                    "details": "Nếu có dữ liệu hoặc giả thuyết về lý do khách hàng giảm tương tác (ví dụ: giá cả, không tìm thấy sản phẩm phù hợp, trải nghiệm kém), hãy **cá nhân hóa thông điệp** để giải quyết trực tiếp những lo ngại đó. Ví dụ: 'Bạn lo lắng về giá? Hãy xem ưu đãi đặc biệt này!' hoặc 'Chúng tôi đã cải thiện tính năng X theo góp ý của khách hàng'."
                }
            ]
        },
        "51-75%": {
            "rate": "Đang ngủ dần — cần hành động ngay",
            "suggest": [
                {
                    "title": "Tạo nội dung FOMO (Fear Of Missing Out) mạnh mẽ",
                    "details": "Sử dụng các chiến thuật tạo cảm giác **FOMO** (sợ bỏ lỡ) trong các thông điệp. Điều này bao gồm việc nhấn mạnh: **sắp hết hàng** của sản phẩm họ quan tâm, **ưu đãi cuối cùng** không còn lặp lại, hoặc **thời gian khuyến mãi chỉ còn rất ít**. Kèm theo là các lời kêu gọi hành động khẩn cấp. Mục tiêu là thúc đẩy họ hành động ngay trước khi cơ hội biến mất."
                },
                {
                    "title": "Gửi thông báo “Chúng tôi nhớ bạn” kèm mã giảm giá có thời hạn rõ ràng",
                    "details": "Thiết kế một chiến dịch email hoặc tin nhắn với tiêu đề trực tiếp và tình cảm như **“Chúng tôi nhớ bạn!”** hoặc “Đã lâu không gặp…”. Nội dung bày tỏ sự quan tâm và kèm theo một **mã giảm giá hấp dẫn** (ví dụ: 20-30%) cho lần mua tiếp theo, với **thời hạn sử dụng rõ ràng và ngắn ngủi**. Đây là cách tạo sự kết nối cá nhân và động lực mạnh mẽ để họ quay lại."
                },
                {
                    "title": "Áp dụng chiến lược Retargeting mạnh mẽ trên đa kênh",
                    "details": "Tăng cường hiển thị quảng cáo retargeting trên nhiều nền tảng (Facebook, Instagram, Google Display Network, YouTube) nhắm mục tiêu vào nhóm này. Quảng cáo nên hiển thị các sản phẩm họ đã xem, các ưu đãi đặc biệt dành riêng cho họ, hoặc những lời nhắc nhở về giá trị độc đáo của thương hiệu. **Tần suất hiển thị có thể tăng lên một chút** so với nhóm 0-25% và 26-50%."
                }
            ]
        },
        "76-100%": {
            "rate": "Nguy cơ cao — cần chiến dịch đánh thức & tái kích hoạt mạnh mẽ",
            "suggest": [
                {
                    "title": "Chạy chiến dịch nhắc lại đa kênh (Email, SMS, Facebook Ads, Zalo)",
                    "details": "Thực hiện một **chiến dịch nhắc lại đồng bộ và mạnh mẽ trên tất cả các kênh có thể tiếp cận khách hàng**. Điều này bao gồm chuỗi email được thiết kế đặc biệt, tin nhắn SMS trực tiếp với ưu đãi hấp dẫn, quảng cáo Facebook/Instagram nhắm mục tiêu lại, và tin nhắn Zalo (nếu có). **Nội dung và ưu đãi cần nhất quán** trên mọi kênh để tạo hiệu ứng cộng hưởng, đảm bảo thông điệp tiếp cận được khách hàng."
                },
                {
                    "title": "Gọi điện nhắc nhở cá nhân hóa hoặc tổ chức chiến dịch “thức tỉnh” bằng quà tặng miễn phí",
                    "details": "Đối với những khách hàng có giá trị cao hoặc có lịch sử mua sắm đáng kể, cân nhắc việc **gọi điện thoại trực tiếp** từ đội ngũ CSKH hoặc sales. Mục đích không phải là bán hàng mà là tìm hiểu lý do họ 'ngủ quên' và thể hiện sự quan tâm. Ngoài ra, có thể gửi một **quà tặng nhỏ miễn phí** (không cần mua hàng) kèm theo lời nhắn cá nhân, ví dụ: một sản phẩm dùng thử, một món quà lưu niệm. Hành động này thể hiện sự nỗ lực lớn của thương hiệu và có thể tạo ấn tượng mạnh."
                },
                {
                    "title": "Gửi ưu đãi 'quay lại' cực kỳ hấp dẫn và có tính chất cá nhân",
                    "details": "Đưa ra một **ưu đãi cực kỳ hấp dẫn và khó có thể từ chối**, được cá nhân hóa sâu sắc. Ví dụ: 'Chúng tôi muốn bạn quay lại, đây là voucher 50% cho đơn hàng bất kỳ', hoặc 'Bạn có thể chọn 1 sản phẩm miễn phí trong danh mục này'. Ưu đãi này cần được truyền tải với thông điệp chân thành và rõ ràng về giá trị mà khách hàng sẽ nhận được khi quay lại."
                },
                {
                    "title": "Tạo nội dung video ngắn, trực quan về sự thay đổi/cải tiến của sản phẩm/dịch vụ",
                    "details": "Nếu có bất kỳ sự cải tiến lớn nào về sản phẩm, dịch vụ hoặc trải nghiệm khách hàng kể từ lần cuối họ tương tác, hãy tạo các **video ngắn, hấp dẫn** để giới thiệu những thay đổi đó. Gửi video này qua email, đăng trên mạng xã hội và chạy quảng cáo retargeting. Điều này giúp khách hàng thấy rằng thương hiệu vẫn đang phát triển và có những điều mới mẻ đáng để quay lại."
                }
            ]
        }
    },
    "At Risk": {
        "0-25%": {
            "rate": "Bình thường, nhắc nhẹ",
            "suggest": [
                {
                    "title": "Tạo chiến dịch phản hồi với quà tặng bất ngờ để gây chú ý và thu thập insight",
                    "details": "Gửi một email hoặc tin nhắn với tiêu đề gây tò mò, mời khách hàng tham gia một **khảo sát ngắn (2-3 câu hỏi)** hoặc **chia sẻ cảm nghĩ về trải nghiệm gần đây**. Kèm theo lời mời là một **quà tặng bất ngờ** (ví dụ: mã giảm giá nhỏ, sản phẩm dùng thử miễn phí, hoặc điểm thưởng) ngay khi họ hoàn thành. Mục tiêu là không chỉ kích hoạt lại tương tác mà còn để **hiểu nguyên nhân gốc rễ** của sự giảm tương tác một cách thân thiện, không áp lực."
                },
                {
                    "title": "Gửi nhắc nhở nhẹ nhàng, ưu đãi quay lại kèm sản phẩm tương tự lần mua trước",
                    "details": "Sử dụng dữ liệu về **lịch sử mua hàng gần đây nhất** của khách hàng để tạo các nhắc nhở và ưu đãi cá nhân hóa. Ví dụ: 'Bạn đã lâu không mua lại sản phẩm X? Chúng tôi có sản phẩm tương tự Y đang có ưu đãi 10%'. Email/tin nhắn nên có tông điệu nhẹ nhàng, không thúc ép, chỉ tập trung vào việc **gợi nhớ giá trị và sự tiện lợi** của sản phẩm/dịch vụ bạn cung cấp. Kèm theo là một **ưu đãi nhỏ** để khuyến khích hành động."
                },
                {
                    "title": "Cung cấp nội dung có tính giải trí hoặc thông tin hữu ích không liên quan đến bán hàng",
                    "details": "Để giữ chân khách hàng trong tâm trí, hãy gửi các email hoặc tin nhắn chứa **nội dung mang tính giải trí** (ví dụ: các video ngắn, hình ảnh hài hước, câu chuyện thương hiệu) hoặc **thông tin hữu ích** nhưng không trực tiếp bán hàng (ví dụ: mẹo vặt cuộc sống, tin tức ngành, hướng dẫn đơn giản). Mục tiêu là duy trì mối quan hệ và sự hiện diện tích cực, ngay cả khi họ chưa có nhu cầu mua hàng."
                }
            ]
        },
        "26-50%": {
            "rate": "Đang rời rạc — cần ưu đãi & khẩn cấp hóa thông điệp",
            "suggest": [
                {
                    "title": "Ưu đãi có thời hạn cực ngắn để tạo cảm giác khẩn cấp và nội dung 'bạn sắp bỏ lỡ'",
                    "details": "Thiết lập một chiến dịch với **ưu đãi rất hấp dẫn (ví dụ: giảm giá 20-30%)** nhưng có **thời hạn sử dụng cực kỳ ngắn** (chỉ 12-24 giờ). Tiêu đề và nội dung email/tin nhắn cần nhấn mạnh sự khẩn cấp: 'Cơ hội cuối cùng!', 'Bạn sắp bỏ lỡ ưu đãi này!'. Ưu đãi nên tập trung vào các **sản phẩm phổ biến** hoặc những mặt hàng mà khách hàng này đã từng quan tâm để tăng khả năng chuyển đổi. Mục tiêu là kích hoạt hành động mua hàng ngay lập tức."
                },
                {
                    "title": "Gửi mã giảm giá cá nhân hóa cho danh mục sản phẩm yêu thích",
                    "details": "Phân tích lịch sử mua hàng của khách hàng để xác định **danh mục sản phẩm hoặc thương hiệu yêu thích** của họ. Sau đó, gửi một **mã giảm giá cá nhân hóa** áp dụng riêng cho những mặt hàng đó. Mức giảm giá nên đủ lớn để tạo động lực mạnh mẽ. Ví dụ: 'Giảm 25% cho tất cả sản phẩm chăm sóc da bạn yêu thích!'"
                },
                {
                    "title": "Sử dụng Retargeting Ads với thông điệp khẩn cấp và lợi ích rõ ràng",
                    "details": "Chạy các chiến dịch quảng cáo retargeting trên các nền tảng mạng xã hội và Google Display Network, nhắm mục tiêu vào nhóm khách hàng này. Quảng cáo nên chứa **thông điệp khẩn cấp** về ưu đãi giới hạn thời gian hoặc sự khan hiếm sản phẩm. Đồng thời, **nhấn mạnh lại các lợi ích cốt lõi** của sản phẩm/dịch vụ để nhắc nhở họ về giá trị mà họ đã từng nhận được."
                }
            ]
        },
        "51-75%": {
            "rate": "Đáng báo động, phải remarketing đồng loạt",
            "suggest": [
                {
                    "title": "Tích hợp email, SMS và quảng cáo đồng thời để khơi lại tương tác một cách toàn diện",
                    "details": "Triển khai một **chiến dịch remarketing tổng lực trên nhiều kênh cùng lúc**. Gửi **email với ưu đãi hấp dẫn**, đồng thời gửi **SMS nhắc nhở** và chạy **quảng cáo đa nền tảng** (Facebook, Google, Zalo) với nội dung nhất quán. Sự xuất hiện đồng thời trên nhiều kênh sẽ giúp thông điệp của bạn tiếp cận khách hàng hiệu quả hơn và tạo hiệu ứng cộng hưởng, phá vỡ sự thờ ơ của họ."
                },
                {
                    "title": "Gửi thông điệp 'Chúng tôi nhớ bạn' kèm ưu đãi 'không thể từ chối'",
                    "details": "Sử dụng một thông điệp chân thành và tình cảm như 'Chúng tôi nhớ bạn!' hoặc 'Đã lâu không gặp, có phải bạn đang gặp vấn đề gì không?'. Kèm theo đó là một **ưu đãi cực kỳ mạnh mẽ** mà hiếm khi bạn cung cấp (ví dụ: giảm giá 40-50%, mua 1 tặng 1, hoặc sản phẩm miễn phí). Ưu đãi này phải được thiết kế để vượt qua mọi rào cản và khiến khách hàng cảm thấy 'hời' khi quay lại."
                },
                {
                    "title": "Tổ chức GIVEAWAY hoặc cuộc thi lớn với giải thưởng cực kỳ hấp dẫn",
                    "details": "Để tái kích hoạt sự quan tâm, tổ chức một **GIVEAWAY hoặc cuộc thi lớn** trên các nền tảng mạng xã hội với **giải thưởng có giá trị rất cao** (ví dụ: một sản phẩm chủ lực miễn phí, voucher mua hàng lớn, hoặc một trải nghiệm độc đáo). Yêu cầu khách hàng tham gia bằng cách tương tác với nội dung, chia sẻ, hoặc tag bạn bè. Mục tiêu là tạo ra sự lan tỏa và thu hút sự chú ý trở lại."
                }
            ]
        },
        "76-100%": {
            "rate": "Rất nguy hiểm! Tỉ trọng cao ở đây là báo động đỏ — ưu tiên cứu vớt nhóm này",
            "suggest": [
                {
                    "title": "Đầu tư vào chăm sóc cá nhân hóa (tele-sale, CSKH riêng) để giữ chân",
                    "details": "Đây là nhóm khách hàng đang ở mức báo động, cần sự can thiệp mạnh mẽ và cá nhân hóa. **Chỉ định nhân viên CSKH hoặc telesales có kinh nghiệm** để **chủ động gọi điện trực tiếp** cho từng khách hàng. Mục đích là để lắng nghe lý do họ không tương tác, giải quyết các vấn đề còn tồn đọng (nếu có), và thể hiện sự trân trọng. Cuộc gọi này không mang nặng tính bán hàng mà là **xây dựng lại mối quan hệ và niềm tin**."
                },
                {
                    "title": "Áp dụng chiến lược 'chăm sóc VIP' và ưu đãi độc quyền không công khai",
                    "details": "Đối xử với nhóm này như những khách hàng VIP đặc biệt. Cung cấp **ưu đãi độc quyền, không công khai** trên bất kỳ kênh nào khác. Điều này có thể là: tặng một sản phẩm cao cấp miễn phí, mời tham gia một sự kiện riêng tư, hoặc cung cấp dịch vụ hỗ trợ ưu tiên trọn đời. Những ưu đãi này phải đủ lớn để khiến họ cảm thấy được trân trọng và có động lực mạnh mẽ để quay lại."
                },
                {
                    "title": "Gửi thư tay cá nhân từ người quản lý cấp cao/CEO kèm quà tặng tri ân",
                    "details": "Đây là một chiến lược rất tốn kém nhưng cực kỳ hiệu quả với nhóm khách hàng có giá trị cao và đang ở mức báo động. **Gửi một lá thư tay cá nhân** từ CEO hoặc quản lý cấp cao của bạn, bày tỏ sự tiếc nuối khi họ giảm tương tác và mong muốn được phục vụ lại. Kèm theo lá thư là một **quà tặng tri ân có giá trị thực sự** (không chỉ là mã giảm giá) để thể hiện sự chân thành và nỗ lực cuối cùng trong việc giành lại họ."
                },
                {
                    "title": "Phân tích nguyên nhân sâu xa nhất và điều chỉnh mô hình kinh doanh nếu cần",
                    "details": "Nếu tỷ lệ 'At Risk' ở mức cao đáng báo động (trên 75%), đây không chỉ là vấn đề chăm sóc khách hàng mà có thể là **dấu hiệu của vấn đề lớn hơn trong mô hình kinh doanh, sản phẩm, hoặc dịch vụ**. Tiến hành **phân tích dữ liệu sâu rộng**, thu thập phản hồi từ các cuộc gọi cá nhân, và xem xét lại toàn bộ chiến lược. Đôi khi, việc cần làm là **thay đổi cốt lõi** để đáp ứng tốt hơn nhu cầu thị trường, thay vì chỉ cố gắng 'cứu vớt' từng khách hàng."
                }
            ]
        }
    },
    "Can't Lose Them": {
        "0-25%": {
            "rate": "Tốt, đang ít nhưng quan trọng",
            "suggest": [
                {
                    "title": "Liên hệ cá nhân hóa từ CSKH để chăm sóc riêng và thu thập thông tin",
                    "details": "Chỉ định một nhân viên **Chăm sóc khách hàng (CSKH) chuyên biệt** để **chủ động liên hệ** với nhóm khách hàng này (qua điện thoại, email cá nhân, hoặc tin nhắn). Mục tiêu của cuộc gọi không phải là bán hàng mà là **hỏi thăm, bày tỏ sự quan tâm**, và **thu thập thông tin sâu hơn** về trải nghiệm của họ, những khó khăn họ có thể đang gặp phải, hoặc những mong muốn chưa được đáp ứng. Ghi nhận chi tiết phản hồi để cải thiện dịch vụ và cá nhân hóa các tương tác sau này."
                },
                {
                    "title": "Gửi email thăm hỏi, offer hoàn tiền hoặc đổi sản phẩm nếu không hài lòng",
                    "details": "Thiết lập chuỗi email thăm hỏi định kỳ, không chỉ tập trung vào bán hàng mà là **thể hiện sự quan tâm đến trải nghiệm của khách hàng**. Nếu khách hàng bày tỏ bất kỳ sự không hài lòng nào, hãy **chủ động đề nghị các giải pháp mạnh mẽ** như hoàn tiền, đổi sản phẩm miễn phí, hoặc tặng voucher bù đắp. Mục tiêu là giải quyết triệt để mọi vấn đề và đảm bảo họ luôn hài lòng, dù có phải chịu một khoản chi phí nhỏ."
                },
                {
                    "title": "Cung cấp quyền truy cập sớm hoặc ưu đãi đặc biệt cho sản phẩm mới",
                    "details": "Để củng cố mối quan hệ, hãy cho nhóm khách hàng này **quyền truy cập sớm** vào các sản phẩm/dịch vụ mới sắp ra mắt hoặc **ưu đãi độc quyền** dành cho những sản phẩm đó trước khi công bố rộng rãi. Điều này tạo cảm giác họ là những người đầu tiên được trải nghiệm và được trân trọng, tăng cường sự gắn kết với thương hiệu."
                }
            ]
        },
        "26-50%": {
            "rate": "Có thể cứu bằng ưu đãi và khảo sát",
            "suggest": [
                {
                    "title": "Tạo deal độc quyền, giới hạn thời gian chỉ dành riêng cho nhóm này",
                    "details": "Thiết kế một **deal (ưu đãi) cực kỳ hấp dẫn và độc quyền**, không công khai trên các kênh khác, chỉ dành riêng cho nhóm khách hàng này. Deal này nên có **thời hạn sử dụng rất ngắn** (ví dụ: 24-48 giờ) và mức giảm giá/ưu đãi phải đủ lớn để tạo động lực mạnh mẽ. Quảng bá deal này thông qua email, SMS với tiêu đề và nội dung nhấn mạnh tính độc quyền và sự khẩn cấp."
                },
                {
                    "title": "Mời tham gia khảo sát chuyên sâu kèm mã giảm giá 20%",
                    "details": "Gửi lời mời tham gia một **khảo sát sâu hơn** về trải nghiệm tổng thể của họ với thương hiệu. Khảo sát này nên tập trung vào các yếu tố về sản phẩm, dịch vụ, chăm sóc khách hàng, và lý do tiềm năng khiến họ cảm thấy không còn gắn bó. Kèm theo lời mời là một **mã giảm giá hấp dẫn (ví dụ: 20%)** cho lần mua tiếp theo như lời cảm ơn cho sự đóng góp của họ. Phân tích kỹ lưỡng dữ liệu từ khảo sát để điều chỉnh chiến lược."
                },
                {
                    "title": "Cung cấp hỗ trợ ưu tiên hoặc tư vấn 1-1 miễn phí",
                    "details": "Đề xuất một buổi **tư vấn 1-1 miễn phí** với chuyên gia của bạn (nếu phù hợp với ngành hàng) hoặc cung cấp **quyền truy cập vào kênh hỗ trợ ưu tiên**. Điều này giúp khách hàng cảm thấy được quan tâm đặc biệt và có thể giải quyết các vấn đề sâu hơn mà họ đang gặp phải, từ đó củng cố lại niềm tin và mối quan hệ."
                }
            ]
        },
        "51-75%": {
            "rate": "Quan trọng — cần chăm sóc cá nhân hóa",
            "suggest": [
                {
                    "title": "Tổ chức sự kiện khách hàng VIP kèm thư mời đặc biệt và quà tặng giá trị",
                    "details": "Đầu tư vào việc tổ chức các **sự kiện VIP độc quyền** (offline hoặc online) chỉ dành cho nhóm khách hàng này. Gửi **thư mời đặc biệt, được thiết kế tinh xảo và cá nhân hóa**, mời họ tham gia. Sự kiện có thể là buổi giới thiệu sản phẩm mới sớm, workshop chuyên sâu, hoặc một buổi tiệc tri ân. Kèm theo sự kiện là **quà tặng có giá trị cao**, không chỉ là voucher giảm giá mà là sản phẩm độc đáo hoặc trải nghiệm đặc biệt. Mục tiêu là tạo ra một trải nghiệm khó quên và củng cố vị thế VIP của họ."
                },
                {
                    "title": "Áp dụng combo: ưu đãi sâu – quà tặng độc quyền – lời cảm ơn chân thành",
                    "details": "Khi liên hệ với nhóm này, hãy kết hợp một gói kích hoạt mạnh mẽ: **ưu đãi giảm giá sâu** (ví dụ: 30-40% hoặc mua 1 tặng 1), kèm theo một **quà tặng độc quyền** (không bán ra thị trường, có giá trị tinh thần hoặc vật chất cao), và một **thư cảm ơn chân thành, viết tay (nếu có thể)** từ quản lý cấp cao. Gói combo này thể hiện sự nỗ lực tối đa của doanh nghiệp trong việc giữ chân họ."
                },
                {
                    "title": "Thiết lập kênh liên lạc trực tiếp với quản lý cấp cao hoặc người sáng lập",
                    "details": "Đối với một số khách hàng cực kỳ quan trọng trong nhóm này, hãy cung cấp **kênh liên lạc trực tiếp** với một quản lý cấp cao hoặc thậm chí là người sáng lập/CEO của công ty. Điều này không chỉ thể hiện sự trân trọng tuyệt đối mà còn đảm bảo mọi vấn đề của họ được giải quyết nhanh chóng và ở cấp độ cao nhất. Kênh này có thể là một số điện thoại riêng, một địa chỉ email đặc biệt."
                }
            ]
        },
        "76-100%": {
            "rate": "Rất đáng báo động với tỉ trọng cao — mất họ có thể mất nhiều giá trị",
            "suggest": [
                {
                    "title": "Cung cấp dịch vụ hậu mãi cao cấp miễn phí và ưu tiên tuyệt đối",
                    "details": "Cam kết cung cấp **dịch vụ hậu mãi cao cấp nhất** cho nhóm này, hoàn toàn **miễn phí** hoặc với **ưu tiên tuyệt đối**. Điều này bao gồm: bảo hành mở rộng, sửa chữa/bảo trì tận nơi, hỗ trợ 24/7 với thời gian phản hồi gần như tức thì, và các dịch vụ bổ sung khác tùy thuộc vào ngành. Mục tiêu là loại bỏ mọi gánh nặng và khiến họ cảm thấy an tâm tuyệt đối khi sử dụng sản phẩm/dịch vụ của bạn."
                },
                {
                    "title": "Dùng chăm sóc đặc biệt (CSKH riêng, gọi điện cá nhân, ưu đãi VIP trọn đời)",
                    "details": "Triển khai một chiến lược **chăm sóc khách hàng siêu cá nhân hóa**. Mỗi khách hàng trong nhóm này nên có một **quản lý tài khoản (Account Manager) riêng biệt** làm đầu mối liên hệ. Thực hiện **gọi điện định kỳ** để thăm hỏi, lắng nghe và giải quyết mọi nhu cầu. Cung cấp **các ưu đãi VIP trọn đời** hoặc **giảm giá vĩnh viễn** cho các sản phẩm/dịch vụ cốt lõi mà họ thường sử dụng. Đây là nỗ lực cuối cùng để giành lại và giữ chân những khách hàng vô cùng giá trị."
                },
                {
                    "title": "Mời tham gia vào các quyết định chiến lược hoặc nhóm cố vấn",
                    "details": "Cho những khách hàng này cơ hội **tham gia vào các buổi họp kín hoặc nhóm cố vấn** để đóng góp ý kiến vào các quyết định chiến lược của doanh nghiệp, phát triển sản phẩm mới, hoặc cải tiến dịch vụ. Sự tham gia này không chỉ mang lại insights giá trị mà còn khiến họ cảm thấy là một phần không thể thiếu của thương hiệu, tạo sự gắn kết cực kỳ sâu sắc."
                },
                {
                    "title": "Xem xét lại mô hình kinh doanh hoặc sản phẩm cốt lõi nếu tỷ lệ quá cao",
                    "details": "Nếu tỷ lệ 'Can't Lose Them' ở mức 76-100% và đang có xu hướng giảm, đây là một **dấu hiệu báo động đỏ cực kỳ nghiêm trọng**. Điều này cho thấy có thể có vấn đề cơ bản với **sản phẩm cốt lõi, mô hình kinh doanh, hoặc trải nghiệm khách hàng tổng thể**. Doanh nghiệp cần tiến hành **đánh giá toàn diện và triệt để** để tìm ra nguyên nhân sâu xa nhất. Có thể cần một sự thay đổi chiến lược lớn để ngăn chặn việc mất đi những khách hàng quan trọng nhất."
                }
            ]
        }
    },
    "Lost": {
        "0-25%": {
            "rate": "Ổn nếu tỉ trọng thấp, có thể bỏ qua 1 phần",
            "suggest": [
                {
                    "title": "Gửi email khảo sát để tìm hiểu nguyên nhân mất khách và cải thiện sản phẩm/dịch vụ",
                    "details": "Thiết kế một **khảo sát đơn giản và nhanh chóng** để gửi đến những khách hàng đã 'mất'. Tập trung vào các câu hỏi mở về lý do họ không còn sử dụng sản phẩm/dịch vụ, những vấn đề họ gặp phải, hoặc điều gì có thể khiến họ quay lại. Đảm bảo khảo sát không quá dài và có thể tặng một **ưu đãi nhỏ** (ví dụ: điểm thưởng, giảm giá nhẹ cho lần mua tiếp theo) như lời cảm ơn khi họ hoàn thành. Mục tiêu chính là **thu thập insights giá trị** để cải thiện sản phẩm/dịch vụ trong tương lai, chứ không phải để 'win-back' ngay lập tức."
                },
                {
                    "title": "Cung cấp bản tin hoặc nội dung tổng hợp hữu ích định kỳ",
                    "details": "Duy trì việc gửi các **bản tin hoặc email tổng hợp nội dung hữu ích** (ví dụ: các bài blog mới nhất, tin tức ngành, mẹo vặt liên quan đến sản phẩm/dịch vụ của bạn) nhưng **không kèm theo ưu đãi bán hàng**. Mục tiêu là giữ cho thương hiệu của bạn **hiện diện trong tâm trí khách hàng một cách tích cực**, cung cấp giá trị thông tin mà không tạo áp lực. Điều này có thể khiến họ quay lại khi có nhu cầu trong tương lai, hoặc ít nhất là họ vẫn có cái nhìn tốt về thương hiệu."
                },
                {
                    "title": "Tối ưu hóa quy trình 'offboarding' (hủy dịch vụ/ngừng tương tác)",
                    "details": "Nếu khách hàng chủ động ngừng sử dụng dịch vụ hoặc hủy tài khoản, hãy đảm bảo quy trình này diễn ra **mượt mà và không gây khó chịu**. Trong quá trình này, có thể đưa ra một **lời mời nhỏ để phản hồi** lý do họ rời đi. Một trải nghiệm 'offboarding' tốt sẽ giúp duy trì thiện chí và mở cánh cửa cho khả năng họ quay lại trong tương lai."
                }
            ]
        },
        "26-50%": {
            "rate": "Nên triển khai win-back có chọn lọc",
            "suggest": [
                {
                    "title": "Thiết kế chiến dịch win-back với ưu đãi đặc biệt và thời hạn rõ ràng",
                    "details": "Đối với những khách hàng có giá trị tiềm năng hoặc đã từng có lịch sử chi tiêu tốt, hãy triển khai **chiến dịch win-back tập trung**. Gửi email hoặc tin nhắn với **ưu đãi cực kỳ hấp dẫn** như: giảm giá 50% cho đơn hàng đầu tiên quay lại, miễn phí vận chuyển trọn đời cho một khoảng thời gian, hoặc tặng một sản phẩm/dịch vụ miễn phí khi mua hàng. Ưu đãi cần có **thời hạn sử dụng rõ ràng** để tạo tính cấp bách. Nội dung thông điệp nên bày tỏ sự tiếc nuối khi họ không còn tương tác và mong muốn được chào đón họ trở lại."
                },
                {
                    "title": "Gợi ý sản phẩm dựa trên dữ liệu mua hàng cũ kèm ưu đãi đi kèm",
                    "details": "Phân tích **lịch sử mua hàng cũ** của khách hàng để gợi ý các sản phẩm/dịch vụ mà họ đã từng mua hoặc có liên quan. Kèm theo gợi ý là một **ưu đãi đặc biệt** cho những sản phẩm đó. Ví dụ: 'Sản phẩm X bạn yêu thích đã có phiên bản mới với ưu đãi 40% chỉ dành cho bạn!'. Điều này thể hiện bạn vẫn hiểu và quan tâm đến sở thích của họ, mặc dù họ đã ngừng tương tác."
                },
                {
                    "title": "Cung cấp một kênh phản hồi trực tiếp và cam kết giải quyết vấn đề",
                    "details": "Trong các thông điệp win-back, hãy cung cấp một **kênh phản hồi trực tiếp** (ví dụ: một địa chỉ email riêng, số hotline) để khách hàng có thể chia sẻ các vấn đề hoặc lý do họ rời đi. Đồng thời, **cam kết rõ ràng sẽ lắng nghe và tìm cách giải quyết** mọi khó khăn của họ. Điều này tạo cơ hội để bạn khắc phục các sai lầm và xây dựng lại niềm tin."
                }
            ]
        },
        "51-75%": {
            "rate": "Mất nhiều — cần remarketing mạnh",
            "suggest": [
                {
                    "title": "Chạy chiến dịch remarketing đồng bộ trên mạng xã hội và email chuỗi",
                    "details": "Triển khai một **chiến dịch remarketing mạnh mẽ trên đa kênh**: **quảng cáo trên Facebook, Instagram, Google Display Network** nhắm mục tiêu vào nhóm khách hàng này với thông điệp cá nhân hóa. Đồng thời, gửi một **chuỗi email khuyến mãi gia tăng** (tức là mức ưu đãi sẽ tăng dần qua các email nếu khách hàng chưa phản hồi). Các thông điệp cần nhấn mạnh lợi ích bị bỏ lỡ và sự khẩn cấp của ưu đãi."
                },
                {
                    "title": "Sử dụng SMS marketing và tin nhắn qua Zalo/Viber (nếu phù hợp)",
                    "details": "Kết hợp **SMS marketing** và các nền tảng tin nhắn như **Zalo/Viber** (nếu khách hàng đã đồng ý nhận tin). Các tin nhắn nên ngắn gọn, trực tiếp, và chứa các ưu đãi hấp dẫn hoặc lời nhắc nhở khẩn cấp về chương trình khuyến mãi. Kênh này thường có tỷ lệ mở cao hơn email, giúp tăng khả năng tiếp cận khách hàng đã 'mất'."
                },
                {
                    "title": "Tạo nội dung video ngắn giới thiệu lại giá trị cốt lõi của thương hiệu",
                    "details": "Sản xuất các **video ngắn, hấp dẫn** để **nhắc nhở khách hàng về giá trị cốt lõi** mà thương hiệu của bạn mang lại. Video có thể giới thiệu về câu chuyện thương hiệu, những cải tiến mới nhất, hoặc các lợi ích độc đáo của sản phẩm/dịch vụ. Chạy các video này qua quảng cáo retargeting để tiếp cận khách hàng 'đã mất', khơi gợi lại những ký ức tích cực về thương hiệu."
                }
            ]
        },
        "76-100%": {
            "rate": "Cực kỳ nguy hiểm — mất mát lớn, cần cải tổ chiến lược giữ chân",
            "suggest": [
                {
                    "title": "Cải tổ toàn bộ chiến lược giữ chân và chăm sóc khách hàng",
                    "details": "Tỷ lệ 'Lost' cao như vậy là một **dấu hiệu khủng hoảng nghiêm trọng**. Doanh nghiệp cần tiến hành **đánh giá và cải tổ toàn bộ chiến lược giữ chân khách hàng (retention strategy)**. Điều này bao gồm: **phân tích sâu dữ liệu** để xác định nguyên nhân chính gây mất khách hàng, **đánh giá lại trải nghiệm khách hàng ở mọi điểm chạm**, và **thiết kế lại các chương trình loyalty, chính sách ưu đãi**. Có thể cần sự tham gia của các chuyên gia tư vấn bên ngoài để có cái nhìn khách quan."
                },
                {
                    "title": "Phối hợp Call Center/đội ngũ Tele-sales để gọi lại khách hàng cũ một cách cá nhân hóa",
                    "details": "Đầu tư vào việc thiết lập một **Call Center chuyên biệt** hoặc giao nhiệm vụ cho đội ngũ **tele-sales có kinh nghiệm** để **gọi điện trực tiếp từng khách hàng đã 'mất'**. Mục tiêu của cuộc gọi không phải là bán hàng mà là **lắng nghe, hỏi thăm, và thể hiện sự quan tâm sâu sắc**. Cung cấp các giải pháp cụ thể cho những vấn đề họ có thể đã gặp phải, và **đề nghị các ưu đãi cực kỳ hấp dẫn** để khuyến khích họ quay lại. Ghi nhận mọi phản hồi để cải thiện dịch vụ."
                },
                {
                    "title": "Triển khai chiến dịch 'Thức tỉnh' với ưu đãi cực đoan và cam kết mới",
                    "details": "Thiết kế một **chiến dịch 'thức tỉnh' (wake-up campaign) với các ưu đãi 'cực đoan'** mà bạn chưa bao giờ cung cấp trước đây (ví dụ: hoàn tiền 100% nếu không hài lòng sau X ngày, tặng sản phẩm/dịch vụ giá trị cao miễn phí khi mua lại). Kèm theo ưu đãi là **lời cam kết mới từ thương hiệu** về chất lượng sản phẩm, dịch vụ khách hàng, hoặc những cải tiến lớn đã được thực hiện. Thông điệp cần thể hiện sự chân thành và quyết tâm muốn giành lại họ."
                },
                {
                    "title": "Sẵn sàng chấp nhận rủi ro để giành lại khách hàng quý giá",
                    "details": "Trong tình huống này, doanh nghiệp cần **sẵn sàng chấp nhận rủi ro và chi phí cao hơn** để giành lại những khách hàng có giá trị. Điều này có thể bao gồm việc **đền bù thiệt hại (nếu có)**, cung cấp **dịch vụ hỗ trợ cá nhân 1-1 trọn đời**, hoặc thậm chí là **xây dựng lại mối quan hệ từ đầu** bằng cách mời họ tham gia các buổi thử nghiệm sản phẩm/dịch vụ mới nhất. Mục tiêu là biến một trải nghiệm tiêu cực thành một cơ hội để thể hiện sự tận tâm của thương hiệu."
                }
            ]
        }
    },
    "Hibernating": {
        "0-25%": {
            "rate": "Bình thường — chỉ “ngủ đông” chưa chắc mất",
            "suggest": [
                {
                    "title": "Gửi lại email với lời chào thân thiện hoặc cập nhật sản phẩm mới",
                    "details": "Hãy bắt đầu bằng những email nhẹ nhàng, không áp lực. Nội dung có thể là một **lời chào hỏi thân thiện**, một **cập nhật về tính năng mới** của sản phẩm/dịch vụ, hoặc **giới thiệu các sản phẩm mới ra mắt** mà không kèm theo ưu đãi lớn. Mục tiêu là để khách hàng biết bạn vẫn ở đây và có những điều mới mẻ, hữu ích để cung cấp."
                },
                {
                    "title": "Tập trung vào nội dung giá trị, không dùng khuyến mãi mạnh",
                    "details": "Thay vì ưu đãi, hãy gửi các **nội dung giá trị** như bài viết blog hướng dẫn sử dụng sản phẩm, mẹo vặt liên quan đến ngành, hoặc các câu chuyện thành công từ những khách hàng khác. Điều này giúp duy trì sự kết nối, cung cấp giá trị thông tin và giữ cho thương hiệu luôn hiện diện một cách tích cực trong tâm trí khách hàng mà không tạo áp lực mua hàng."
                },
                {
                    "title": "Nhắc nhở về các sản phẩm đã xem hoặc thêm vào yêu thích",
                    "details": "Gửi email/tin nhắn nhắc nhở nhẹ nhàng về các sản phẩm mà họ đã từng xem hoặc thêm vào danh sách yêu thích nhưng chưa mua. Thông điệp có thể là 'Sản phẩm X vẫn đang chờ bạn!' hoặc 'Bạn có thể quan tâm đến những mặt hàng này'. Mục tiêu là gợi lại sự quan tâm mà không cần đến các ưu đãi quá lớn."
                }
            ]
        },
        "26-50%": {
            "rate": "Có thể đánh thức bằng ưu đãi nhẹ",
            "suggest": [
                {
                    "title": "Mời tham gia chương trình dùng thử sản phẩm/dịch vụ miễn phí hoặc chi phí thấp",
                    "details": "Nếu có sản phẩm hoặc tính năng mới, hãy mời nhóm khách hàng này tham gia **chương trình dùng thử miễn phí hoặc với chi phí rất thấp**. Điều này giúp họ trải nghiệm lại giá trị của bạn mà không phải cam kết tài chính lớn, đồng thời cung cấp cơ hội thu thập phản hồi quý giá. Đây là một cách hiệu quả để 'đánh thức' sự quan tâm của họ."
                },
                {
                    "title": "Chiến dịch 'Chào mừng trở lại' kèm ưu đãi nhẹ và giới thiệu sản phẩm mới",
                    "details": "Thiết kế một chiến dịch email/tin nhắn với tiêu đề ấm áp như **'Chào mừng trở lại!'** hoặc 'Chúng tôi nhớ bạn!'. Kèm theo một **ưu đãi nhẹ** (ví dụ: giảm giá 10% cho đơn hàng đầu tiên, hoặc miễn phí vận chuyển) và **giới thiệu các sản phẩm/dịch vụ mới nhất** của bạn. Mục tiêu là khơi gợi lại sự hứng thú và tạo động lực để họ quay lại mua hàng."
                },
                {
                    "title": "Cung cấp nội dung cá nhân hóa dựa trên sở thích cũ và hành vi duyệt web",
                    "details": "Phân tích dữ liệu về sở thích mua hàng trước đây và hành vi duyệt web của họ. Gửi các email hoặc hiển thị quảng cáo với **nội dung và gợi ý sản phẩm được cá nhân hóa sâu sắc**. Ví dụ: nếu họ từng mua sản phẩm về chăm sóc da, hãy gửi các bài viết về mẹo chăm sóc da hoặc giới thiệu sản phẩm chăm sóc da mới phù hợp với loại da của họ."
                }
            ]
        },
        "51-75%": {
            "rate": "Cần truyền thông lại — social & email",
            "suggest": [
                {
                    "title": "Tặng voucher sinh nhật hoặc vào các dịp đặc biệt khác",
                    "details": "Nếu bạn có thông tin ngày sinh nhật của khách hàng, hãy gửi một **voucher sinh nhật cá nhân hóa với mức giảm giá hấp dẫn** (ví dụ: 15-20%). Ngoài ra, hãy xem xét các dịp đặc biệt khác như ngày kỷ niệm họ trở thành khách hàng đầu tiên, hoặc các ngày lễ lớn. Đây là cách tạo sự kết nối cá nhân và động lực để họ quay lại mua sắm."
                },
                {
                    "title": "Sử dụng Retargeting Ads kết hợp Email và Social Media để khơi gợi mạnh mẽ",
                    "details": "Triển khai một chiến dịch **retargeting tích hợp đa kênh**. Chạy **quảng cáo trên Facebook, Instagram, Google Display Network** nhắm mục tiêu vào nhóm này với các thông điệp gợi nhớ và ưu đãi hấp dẫn. Đồng thời, gửi các **email được thiết kế bắt mắt** và **post trên social media** để tạo hiệu ứng cộng hưởng, đảm bảo thông điệp tiếp cận họ một cách mạnh mẽ và liên tục."
                },
                {
                    "title": "Tạo các chương trình khuyến mãi nhỏ, có thời hạn giới hạn",
                    "details": "Thường xuyên tổ chức các chương trình **khuyến mãi nhỏ với thời hạn giới hạn** (ví dụ: 'Giảm giá X% cho 3 ngày duy nhất!'). Quảng bá các chương trình này thông qua email, social media và retargeting ads. Điều này giúp tạo cảm giác cấp bách và khuyến khích hành động nhanh chóng từ nhóm khách hàng đang 'ngủ đông'."
                }
            ]
        },
        "76-100%": {
            "rate": "Rủi ro cao, phải tìm nguyên nhân sâu và cải tổ hành trình",
            "suggest": [
                {
                    "title": "Tạo chiến dịch 'Chúng tôi nhớ bạn' cá nhân hóa với ưu đãi mạnh",
                    "details": "Thiết kế một chiến dịch đặc biệt mang tên **'Chúng tôi nhớ bạn'** hoặc **'Đã lâu không gặp!'**. Thông điệp cần mang tính **cá nhân hóa cao**, bày tỏ sự tiếc nuối khi họ không còn tương tác. Kèm theo là một **ưu đãi mạnh mẽ** (ví dụ: giảm giá 30-40% cho đơn hàng tiếp theo, tặng một sản phẩm miễn phí có giá trị) để tạo động lực quay lại. Ưu đãi này cần được truyền tải qua nhiều kênh: email, SMS, và có thể là quảng cáo cá nhân hóa."
                },
                {
                    "title": "Đầu tư khảo sát tìm lý do 'ngủ đông' và tái cấu trúc lại hành trình khách hàng",
                    "details": "Với tỷ lệ cao như vậy, cần một **nghiên cứu sâu rộng** để hiểu lý do tại sao nhóm khách hàng này 'ngủ đông'. Tổ chức các **khảo sát chi tiết**, **phỏng vấn cá nhân**, hoặc **nhóm tập trung (focus group)**. Dựa trên insights thu được, cần **tái cấu trúc lại toàn bộ hành trình khách hàng**, từ lúc tiếp cận ban đầu, trải nghiệm mua sắm, đến dịch vụ hậu mãi, để loại bỏ các 'điểm đau' có thể khiến khách hàng rời đi. Điều này có thể đòi hỏi thay đổi cả về sản phẩm hoặc chính sách."
                },
                {
                    "title": "Thực hiện các chiến dịch 'đánh thức' bằng nội dung trải nghiệm độc đáo",
                    "details": "Ngoài ưu đãi, hãy tạo ra những **trải nghiệm độc đáo** để 'đánh thức' khách hàng. Điều này có thể là mời họ tham gia một buổi **workshop trực tuyến miễn phí**, xem **buổi giới thiệu sản phẩm độc quyền**, hoặc nhận một **gói dùng thử sản phẩm mới** được gửi tận nhà. Mục tiêu là tạo ra sự hứng thú và tò mò, khiến họ muốn tương tác lại với thương hiệu."
                },
                {
                    "title": "Cân nhắc chính sách hoàn tiền/đổi trả linh hoạt hơn để giảm rào cản quay lại",
                    "details": "Nếu lý do 'ngủ đông' liên quan đến sự không hài lòng về sản phẩm hoặc dịch vụ, hãy xem xét việc **cải thiện và truyền thông mạnh mẽ chính sách hoàn tiền/đổi trả** của bạn. Đôi khi, việc cung cấp một chính sách linh hoạt hơn, không rủi ro có thể là yếu tố quyết định để khách hàng sẵn sàng quay lại trải nghiệm lại sản phẩm/dịch vụ của bạn."
                }
            ]
        }
    }
}
export function StrategyDialog({ selectedSegment, onClose }: StrategyDialogProps) {
    if (!selectedSegment) return null

    const { name, percentage } = selectedSegment
    const strategies = marketingStrategies[name]
    const perc = Number.parseInt(percentage)
    const range = perc <= 25 ? "0-25%" : perc <= 50 ? "26-50%" : perc <= 75 ? "51-75%" : ("76-100%")

    const message = strategies?.[range]?.["suggest"] ?? "Chưa có chiến lược cho nhóm này."
    const rate = strategies?.[range]?.["rate"] ?? "Chưa có đánh giá cho nhóm này."
    // Determine badge color based on percentage range\
    const goodSegments = [
        "Champions",
        "Loyal Customers",
        "Potential Loyalist",
        "Promising",
        "New Customers"
    ]

    const badSegments = [
        "Lost",
        "At Risk",
        "Hibernating",
        "About To Sleep"
    ]

    const neutralSegments = [
        "Need Attention",
        "Can't Lose Them"
    ]

    const getBadgeColor = (range: string, segment: string): string => {
        const isGood = goodSegments.includes(segment)
        const isBad = badSegments.includes(segment)
        const isNeutral = neutralSegments.includes(segment)

        if (isGood) {
            switch (range) {
                case "0-25%":
                    return "bg-red-100 text-red-800 hover:bg-red-100"
                case "26-50%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "51-75%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "76-100%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        if (isBad) {
            switch (range) {
                case "0-25%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                case "26-50%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "51-75%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "76-100%":
                    return "bg-red-100 text-red-800 hover:bg-red-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        if (isNeutral) {
            switch (range) {
                case "0-25%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "26-50%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "51-75%":
                    return "bg-purple-100 text-purple-800 hover:bg-purple-100"
                case "76-100%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        // fallback nếu không thuộc phân khúc nào
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }

    // Format the message with proper line breaks for display
    const formatMessage = (text: string) => {
        return text.split("\n").map((line, i) => (
            <p key={i} className="py-1">
                {line}
            </p>
        ))
    }

    return (
        <Dialog open={!!selectedSegment} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[90%] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Gợi ý chiến lược quảng bá
                    </DialogTitle>
                </DialogHeader>

                <Card className="border-0 shadow-none flex-1 overflow-hidden">
                    <CardContent className="p-0 h-full overflow-auto">
                        <div className="grid gap-4 p-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Nhóm phân khúc</h3>
                                    <p className="text-lg font-semibold">{translateSegmentName(name)}</p>
                                </div>
                                <Badge className={`${getBadgeColor(range, name)} px-3 py-1 text-xs font-medium`}>{percentage}</Badge>
                            </div>

                            <div className="space-y-4 px-1">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <BarChart className="w-4 h-4 text-muted-foreground" />
                                        <h4 className="text-base font-semibold">Mức độ đánh giá</h4>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{rate}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-muted-foreground" />
                                        <h4 className="text-base font-semibold">Chiến lược gợi ý</h4>
                                    </div>

                                    {Array.isArray(message) && message.length > 0 ? (
                                        <div className="space-y-4">
                                            {message.map((item: any, index: number) => (
                                                <div key={index} className="p-4 rounded-md border bg-background shadow-sm">
                                                    <h5 className="text-sm text-primary font-bold mb-1">
                                                        <ReactMarkdown>{item.title}</ReactMarkdown>
                                                    </h5>
                                                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                                                        <ReactMarkdown>{item.details}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Chưa có chiến lược cho nhóm này.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end mt-4">
                    <Button onClick={onClose}>Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
