import { format, parseISO } from "date-fns";

function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  } catch (error) {
    console.error("Invalid date:", dateString);
    return dateString;
  }
}

const translateSegmentName = (segment: string): string => {
    const translations: Record<string, string> = {
        "Champions": "Khách hàng ưu tú",
        "Loyal Customers": "Khách hàng trung thành",
        "Potential Loyalist": "Tiềm năng trung thành",
        "Promising": "Đầy triển vọng",
        "New Customers": "Khách hàng mới",
        "Need Attention": "Cần quan tâm thêm",
        "Can't Lose Them": "Không thể để mất",
        "At Risk": "Có nguy cơ rời bỏ",
        "About To Sleep": "Sắp ngừng tương tác",
        "Hibernating": "Tạm ngưng hoạt động",
        "Lost": "Đã rời đi"
    }

    return translations[segment] || segment
}

export {translateSegmentName, formatDateTime}