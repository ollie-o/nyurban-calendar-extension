/**
 * Application-wide constants and configuration values.
 */

export const CONFIG = {
  /** Minimum number of table rows to consider schedule loaded */
  SCHEDULE_MIN_ROWS: 5,

  /** Maximum attempts to wait for schedule to load */
  LOAD_MAX_ATTEMPTS: 20,

  /** Delay between schedule load checks (milliseconds) */
  LOAD_RETRY_DELAY_MS: 500,

  /** Default game duration in minutes */
  DEFAULT_GAME_DURATION_MINUTES: 60,

  /** Days threshold for determining if date is in next year */
  YEAR_ROLLOVER_THRESHOLD_DAYS: 60,
} as const;

export const SELECTORS = {
  /** Team name header element */
  TEAM_NAME: '.green_block.team h1 span',

  /** Schedule table element */
  SCHEDULE_TABLE: 'table',

  /** Team details div */
  TEAM_DIV: 'div.green_block.team',
} as const;

export const UI_IDS = {
  /** Main container element ID */
  CONTAINER: 'nyurban-calendar-container',

  /** Game selection checkbox class */
  GAME_CHECKBOX: 'game-checkbox',
} as const;

export const UI_STYLES = {
  CONTAINER_PADDING: '24px',
  CONTAINER_MAX_WIDTH: '900px',
  CONTAINER_MARGIN: '20px auto',
  BUTTON_PADDING: '10px 24px',
  BUTTON_BORDER_RADIUS: '6px',
  TABLE_FONT_SIZE: '14px',
} as const;

export const URL_PATTERNS = {
  /** Team details page path pattern */
  TEAM_DETAILS_PATH: '/team-details/',

  /** Team ID query parameter */
  TEAM_ID_PARAM: 'team_id=',
} as const;
