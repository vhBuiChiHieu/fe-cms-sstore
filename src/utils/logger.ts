/**
 * Logger utility để quản lý việc log trong ứng dụng
 * Cho phép bật/tắt log theo môi trường và loại log
 */

// Cấu hình logger
interface LoggerConfig {
  // Có bật log hay không
  enabled: boolean;
  // Các level được phép log
  levels: {
    debug: boolean;
    info: boolean;
    warn: boolean;
    error: boolean;
  };
  // Có hiển thị timestamp không
  showTimestamp: boolean;
}

// Lấy cấu hình từ biến môi trường hoặc sử dụng giá trị mặc định
const isDevelopment = process.env.NODE_ENV === 'development';

// Cấu hình mặc định
const defaultConfig: LoggerConfig = {
  enabled: isDevelopment,
  levels: {
    debug: isDevelopment,
    info: isDevelopment,
    warn: true,
    error: true,
  },
  showTimestamp: true,
};

// Cấu hình hiện tại
let config: LoggerConfig = { ...defaultConfig };

/**
 * Cập nhật cấu hình logger
 * @param newConfig Cấu hình mới
 */
const configure = (newConfig: Partial<LoggerConfig>): void => {
  config = { ...config, ...newConfig };
};

/**
 * Tạo timestamp cho log
 */
const getTimestamp = (): string => {
  return config.showTimestamp ? `[${new Date().toISOString()}]` : '';
};

/**
 * Log debug - chỉ hiển thị trong môi trường development
 */
const debug = (message: string, ...args: any[]): void => {
  if (config.enabled && config.levels.debug) {
    console.debug(`${getTimestamp()} [DEBUG] ${message}`, ...args);
  }
};

/**
 * Log thông tin - chỉ hiển thị trong môi trường development
 */
const info = (message: string, ...args: any[]): void => {
  if (config.enabled && config.levels.info) {
    console.info(`${getTimestamp()} [INFO] ${message}`, ...args);
  }
};

/**
 * Log cảnh báo - hiển thị trong tất cả môi trường
 */
const warn = (message: string, ...args: any[]): void => {
  if (config.enabled && config.levels.warn) {
    console.warn(`${getTimestamp()} [WARN] ${message}`, ...args);
  }
};

/**
 * Log lỗi - hiển thị trong tất cả môi trường
 */
const error = (message: string, ...args: any[]): void => {
  if (config.enabled && config.levels.error) {
    console.error(`${getTimestamp()} [ERROR] ${message}`, ...args);
  }
};

/**
 * Tắt tất cả log
 */
const disable = (): void => {
  config.enabled = false;
};

/**
 * Bật tất cả log
 */
const enable = (): void => {
  config.enabled = true;
};

/**
 * Tắt log debug và info trong môi trường production
 */
const setupForProduction = (): void => {
  config.levels.debug = false;
  config.levels.info = false;
};

// Export các hàm
const logger = {
  debug,
  info,
  warn,
  error,
  configure,
  disable,
  enable,
  setupForProduction,
};

export default logger;
