/**
 * Định dạng ngày tháng từ chuỗi ISO sang định dạng ngày/tháng/năm
 * @param dateString Chuỗi ngày tháng dạng ISO hoặc định dạng khác
 * @param fallback Giá trị mặc định nếu dateString không hợp lệ
 * @param showTime Có hiển thị giờ phút hay không
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (dateString?: string, fallback = '-', showTime = false): string => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn
 * @param value Giá trị số cần định dạng
 * @param fallback Giá trị mặc định nếu value không hợp lệ
 * @returns Chuỗi số đã định dạng
 */
export const formatNumber = (value?: number | string, fallback = '-'): string => {
  if (value === undefined || value === null) return fallback;
  
  try {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return fallback;
    
    return new Intl.NumberFormat('vi-VN').format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return fallback;
  }
};

/**
 * Định dạng tiền tệ
 * @param value Giá trị cần định dạng
 * @param currency Loại tiền tệ (mặc định là VND)
 * @param fallback Giá trị mặc định nếu value không hợp lệ
 * @returns Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (
  value?: number | string,
  currency = 'VND',
  fallback = '-'
): string => {
  if (value === undefined || value === null) return fallback;
  
  try {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return fallback;
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency
    }).format(number);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return fallback;
  }
};
