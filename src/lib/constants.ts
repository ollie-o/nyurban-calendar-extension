export const CONFIG = {
  SCHEDULE_MIN_ROWS: 5,
  LOAD_MAX_ATTEMPTS: 20,
  LOAD_RETRY_DELAY_MS: 500,
  DEFAULT_GAME_DURATION_MINUTES: 60,
  YEAR_ROLLOVER_THRESHOLD_DAYS: 60,
} as const;

export const SELECTORS = {
  TEAM_NAME: '.green_block.team h1 span',
  SCHEDULE_TABLE: 'table',
  TEAM_DIV: 'div.green_block.team',
} as const;

export const UI_IDS = {
  CONTAINER: 'nyurban-calendar-container',
  GAME_CHECKBOX: 'game-checkbox',
} as const;

export const URL_PATTERNS = {
  TEAM_DETAILS_PATH: '/team-details/',
  TEAM_ID_PARAM: 'team_id=',
} as const;
