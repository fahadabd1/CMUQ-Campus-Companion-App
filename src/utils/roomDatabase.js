// Complete CMUQ Room Database with coordinates (x, y as % of image dimensions)
// Re-mapped with precision from H1 and H2 detailed floor images

export const CATEGORY_DATABASE = {
  'First Floor': {
    'facility': {
      rooms: [
        1004, 1005, 1006, 1007, 1008, 1009, 1010,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021,
        1024, 1025, 1026,
        1036, 1037, 1038, 1039, 1040,
        1077, 1078, 1079, 1080,
        1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211,
        1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181
      ]
    },
    'class-rooms': {
      rooms: [
        1030, 1031, 1032,
        1051,
        1064,
        1131,
        1213,
        1202,
        1199,
        1190,
        1185,
      ]
    },
    'restrooms': {
      rooms: [
        1045, 1046,
        1218, 1220,
        1144, 1142,
        1112, 1113,
      ]
    },
    'study-rooms': {
      rooms: [
        1170, 1171,
        1155, 1154, 1153, 1152,
        1161,
        1087,
        1021,
      ]
    },
    'staff': {
      rooms: [
        1068, 1069, 1070, 1074, 1075, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1098, 1099,
        1100, 1101, 1102, 1103, 1104, 1106, 1107,
        1118, 1119, 1121, 1195, 1196,
        1167, 1165,
        1150, 1151,
        1145,
        1160,
      ]
    }
  }
}

export const ROOM_DATABASE = {
  // ===== FIRST FLOOR =====

  // Far LEFT vertical column (rooms 1001-1011) - from CMU1st.jpg (1143x832px)
  '1001': { floor: 'First Floor', image: 0, x: 14.61, y: 3.49 },
  '1002': { floor: 'First Floor', image: 0, x: 12.78, y: 8.29 },
  '1004': { floor: 'First Floor', image: 0, x: 12.34, y: 11.54 },
  '1005': { floor: 'First Floor', image: 0, x: 12.34, y: 13.34 },
  '1006': { floor: 'First Floor', image: 0, x: 12.34, y: 15.38 },
  '1007': { floor: 'First Floor', image: 0, x: 12.34, y: 17.43 },
  '1008': { floor: 'First Floor', image: 0, x: 12.34, y: 19.47 },
  '1009': { floor: 'First Floor', image: 0, x: 12.34, y: 21.27 },
  '1010': { floor: 'First Floor', image: 0, x: 12.34, y: 23.32 },
  '1011': { floor: 'First Floor', image: 0, x: 12.34, y: 26.80 }, // Blue dot (water)

  // Middle-LEFT vertical column (rooms 1012-1024) - from H1
  '1012': { floor: 'First Floor', image: 0, x: 7, y: 3 }, // Yellow star (recycling)
  '1013': { floor: 'First Floor', image: 0, x: 16.89, y: 7.69 },
  '1014': { floor: 'First Floor', image: 0, x: 16.89, y: 9.38 },
  '1015': { floor: 'First Floor', image: 0, x: 16.89, y: 11.18 },
  '1016': { floor: 'First Floor', image: 0, x: 16.89, y: 13.34 },
  '1017': { floor: 'First Floor', image: 0, x: 16.89, y: 15.51 },
  '1018': { floor: 'First Floor', image: 0, x: 16.89, y: 17.31 },
  '1019': { floor: 'First Floor', image: 0, x: 16.89, y: 19.59 },
  '1020': { floor: 'First Floor', image: 0, x: 16.89, y: 21.39 },
  '1021': { floor: 'First Floor', image: 0, x: 7, y: 31 },
  '1022': { floor: 'First Floor', image: 0, x: 17.15, y: 26.20 },
  '1023': { floor: 'First Floor', image: 0, x: 17.15, y: 28.00 },
  '1024': { floor: 'First Floor', image: 0, x: 19.25, y: 26.92 },
  '1025': { floor: 'First Floor', image: 0, x: 20.82, y: 26.92 },
  '1026': { floor: 'First Floor', image: 0, x: 21.70, y: 26.92 },
  '1027': { floor: 'First Floor', image: 0, x: 23.80, y: 26.92 },

  // UPPER CENTER area (rooms 1030-1033) - from CMU1st.jpg
  '1030': { floor: 'First Floor', image: 0, x: 25.11, y: 9.62 },
  '1031': { floor: 'First Floor', image: 0, x: 29.22, y: 9.26 },
  '1032': { floor: 'First Floor', image: 0, x: 34.21, y: 10.22 },
  '1033': { floor: 'First Floor', image: 0, x: 17, y: 12 },

  // AUDITORIUM and surrounding (1028, 1029, 1035-1040) - from CMU1st.jpg
  '1028': { floor: 'First Floor', image: 0, x: 27.03, y: 22.36 }, // Large circular auditorium
  '1029': { floor: 'First Floor', image: 0, x: 25.81, y: 17.55 },
  '1035': { floor: 'First Floor', image: 0, x: 34.65, y: 17.55 },
  '1036': { floor: 'First Floor', image: 0, x: 31.94, y: 17.43 },
  '1037': { floor: 'First Floor', image: 0, x: 32.28, y: 20.07 },
  '1038': { floor: 'First Floor', image: 0, x: 32.28, y: 21.88 },
  '1039': { floor: 'First Floor', image: 0, x: 32.28, y: 23.80 },
  '1040': { floor: 'First Floor', image: 0, x: 32.28, y: 25.84 }, // Yellow star (recycling)

  // CENTER-RIGHT area (1043-1065, 1080) - from H1
  '1043': { floor: 'First Floor', image: 0, x: 25, y: 36 },
  '1045': { floor: 'First Floor', image: 0, x: 28, y: 36 },
  '1046': { floor: 'First Floor', image: 0, x: 31, y: 36 },
  '1048': { floor: 'First Floor', image: 0, x: 43.13, y: 22.96 },
  '1049': { floor: 'First Floor', image: 0, x: 42.17, y: 17.43 },
  '1050': { floor: 'First Floor', image: 0, x: 41.47, y: 14.30 },
  '1051': { floor: 'First Floor', image: 0, x: 43.04, y: 9.38 },
  '1058': { floor: 'First Floor', image: 0, x: 53.72, y: 11.06 },
  '1060': { floor: 'First Floor', image: 0, x: 43.66, y: 13.82 },
  '1061': { floor: 'First Floor', image: 0, x: 33, y: 25 },
  '1064': { floor: 'First Floor', image: 0, x: 51.44, y: 23.32 },
  '1065': { floor: 'First Floor', image: 0, x: 55.82, y: 21.75 },

  // VERTICAL CORRIDOR area (1066-1080) - from CMU1st.jpg
  '1066': { floor: 'First Floor', image: 0, x: 62.55, y: 25.84 },
  '1068': { floor: 'First Floor', image: 0, x: 62.82, y: 22.72 }, // Yellow star (recycling)
  '1069': { floor: 'First Floor', image: 0, x: 62.82, y: 20.55 },
  '1070': { floor: 'First Floor', image: 0, x: 62.82, y: 18.15 },
  '1072': { floor: 'First Floor', image: 0, x: 66.40, y: 20.91 },
  '1073': { floor: 'First Floor', image: 0, x: 51, y: 32 },
  '1074': { floor: 'First Floor', image: 0, x: 62.91, y: 15.63 },
  '1075': { floor: 'First Floor', image: 0, x: 63.61, y: 13.46 },
  '1076': { floor: 'First Floor', image: 0, x: 51, y: 26 },
  '1077': { floor: 'First Floor', image: 0, x: 69.03, y: 13.82 },
  '1078': { floor: 'First Floor', image: 0, x: 68.94, y: 16.23 },
  '1079': { floor: 'First Floor', image: 0, x: 68.94, y: 18.51 },
  '1080': { floor: 'First Floor', image: 0, x: 68.94, y: 20.79 },

  // UPPER RIGHT area (1053-1056) - from H1
  '1053': { floor: 'First Floor', image: 0, x: 44, y: 5 },
  '1054': { floor: 'First Floor', image: 0, x: 46, y: 5 },
  '1055': { floor: 'First Floor', image: 0, x: 48, y: 5 },
  '1056': { floor: 'First Floor', image: 0, x: 47, y: 7 }, // Blue dot (water)

  // FAR RIGHT offices cluster (1087-1095) - from CMU1st.jpg
  '1087': { floor: 'First Floor', image: 0, x: 55, y: 18 },
  '1089': { floor: 'First Floor', image: 0, x: 63.87, y: 11.42 },
  '1090': { floor: 'First Floor', image: 0, x: 63.78, y: 9.38 },
  '1091': { floor: 'First Floor', image: 0, x: 64.30, y: 6.61 },
  '1092': { floor: 'First Floor', image: 0, x: 64.22, y: 4.09 },
  '1093': { floor: 'First Floor', image: 0, x: 65.71, y: 1.92 },
  '1094': { floor: 'First Floor', image: 0, x: 67.10, y: 1.56 },
  '1095': { floor: 'First Floor', image: 0, x: 68.50, y: 1.80 },
  '1096': { floor: 'First Floor', image: 0, x: 58, y: 27 },
  '1097': { floor: 'First Floor', image: 0, x: 61, y: 18 },
  '1098': { floor: 'First Floor', image: 0, x: 69.90, y: 3.97 },
  '1099': { floor: 'First Floor', image: 0, x: 71.21, y: 3.61 },
  '1100': { floor: 'First Floor', image: 0, x: 72.62, y: 3.85 },
  '1101': { floor: 'First Floor', image: 0, x: 74.10, y: 3.49 },
  '1102': { floor: 'First Floor', image: 0, x: 75.50, y: 3.61 },
  '1103': { floor: 'First Floor', image: 0, x: 76.99, y: 3.61 },
  '1104': { floor: 'First Floor', image: 0, x: 78.48, y: 3.61 },
  '1106': { floor: 'First Floor', image: 0, x: 60, y: 28 },
  '1107': { floor: 'First Floor', image: 0, x: 63, y: 14 },
  '1108': { floor: 'First Floor', image: 0, x: 64, y: 16 },
  '1112': { floor: 'First Floor', image: 0, x: 80, y: 10 },
  '1113': { floor: 'First Floor', image: 0, x: 83, y: 10 },
  '1115': { floor: 'First Floor', image: 0, x: 85, y: 10 },
  '1116': { floor: 'First Floor', image: 0, x: 87, y: 10 },
  '1117': { floor: 'First Floor', image: 0, x: 86.09, y: 3.97 },
  '1118': { floor: 'First Floor', image: 0, x: 89, y: 12 },
  '1119': { floor: 'First Floor', image: 0, x: 90, y: 15 },
  '1121': { floor: 'First Floor', image: 0, x: 82.94, y: 15.63 },

  // NORTHWEST area near 1217 cluster - from CMU1st.jpg
  '1209': { floor: 'First Floor', image: 0, x: 16.97, y: 56.97 },
  '1210': { floor: 'First Floor', image: 0, x: 16.36, y: 54.69 },
  '1211': { floor: 'First Floor', image: 0, x: 16.18, y: 52.88 },
  '1212': { floor: 'First Floor', image: 0, x: 12.07, y: 52.28 },
  '1213': { floor: 'First Floor', image: 0, x: 8.57, y: 60.94 },
  '1214': { floor: 'First Floor', image: 0, x: 8.75, y: 53.13 },
  '1217': { floor: 'First Floor', image: 0, x: 6, y: 4 }, // Yellow star (recycling)

  // CENTER-SOUTH area - from H2
  '1238': { floor: 'First Floor', image: 0, x: 29, y: 19 }, // Yellow star (recycling)
  '1240': { floor: 'First Floor', image: 0, x: 20, y: 42 }, // Blue dot (water)
  '1232': { floor: 'First Floor', image: 0, x: 35, y: 20 },

  // FOOD COURT area (1226, 1266) - from H2
  '1226': { floor: 'First Floor', image: 0, x: 33, y: 42 }, // Yellow star (recycling) - Food Court
  '1266': { floor: 'First Floor', image: 0, x: 35, y: 68 }, // Yellow star near bottom

  // FAR RIGHT side offices (1140-1165) - from H2
  '1140': { floor: 'First Floor', image: 0, x: 73, y: 6 }, // Yellow star (recycling)
  '1141': { floor: 'First Floor', image: 0, x: 75, y: 8 },
  '1143': { floor: 'First Floor', image: 0, x: 79, y: 10 },
  '1144': { floor: 'First Floor', image: 0, x: 60, y: 47 },
  '1145': { floor: 'First Floor', image: 0, x: 65.88, y: 43.75 },
  '1146': { floor: 'First Floor', image: 0, x: 68.95, y: 50.24 },
  '1149': { floor: 'First Floor', image: 0, x: 72.27, y: 46.03 },
  '1150': { floor: 'First Floor', image: 0, x: 72.88, y: 44.23 },
  '1151': { floor: 'First Floor', image: 0, x: 75.76, y: 43.39 },
  '1152': { floor: 'First Floor', image: 0, x: 75.85, y: 46.39 },
  '1153': { floor: 'First Floor', image: 0, x: 75.68, y: 49.16 },
  '1154': { floor: 'First Floor', image: 0, x: 75.76, y: 51.44 },
  '1155': { floor: 'First Floor', image: 0, x: 75.76, y: 54.09 },
  '1156': { floor: 'First Floor', image: 0, x: 61.85, y: 53.97 },
  '1157': { floor: 'First Floor', image: 0, x: 58.71, y: 52.76 },
  '1158': { floor: 'First Floor', image: 0, x: 66.14, y: 55.65 },
  '1159': { floor: 'First Floor', image: 0, x: 55.29, y: 55.53 },
  '1160': { floor: 'First Floor', image: 0, x: 83, y: 18 },
  '1161': { floor: 'First Floor', image: 0, x: 75.68, y: 64.30 },
  '1162': { floor: 'First Floor', image: 0, x: 68.51, y: 79.21 },
  '1163': { floor: 'First Floor', image: 0, x: 80, y: 16 },
  '1164': { floor: 'First Floor', image: 0, x: 62.47, y: 76.80 },
  '1165': { floor: 'First Floor', image: 0, x: 61.50, y: 68.39 },
  '1166': { floor: 'First Floor', image: 0, x: 59.58, y: 63.82 },

  // BOTTOM CURVED section (1167-1199) - from H2
  '1167': { floor: 'First Floor', image: 0, x: 55.56, y: 77.52 },
  '1168': { floor: 'First Floor', image: 0, x: 73.14, y: 65.02 },
  '1169': { floor: 'First Floor', image: 0, x: 57.13, y: 62.62 },
  '1170': { floor: 'First Floor', image: 0, x: 54.16, y: 58.89 },
  '1171': { floor: 'First Floor', image: 0, x: 53.28, y: 60.94 },
  '1172': { floor: 'First Floor', image: 0, x: 54.94, y: 66.11 },
  '1173': { floor: 'First Floor', image: 0, x: 63.34, y: 78.49 },
  '1174': { floor: 'First Floor', image: 0, x: 50.04, y: 65.99 },
  '1175': { floor: 'First Floor', image: 0, x: 48.91, y: 67.31 },
  '1176': { floor: 'First Floor', image: 0, x: 47.77, y: 68.75 },
  '1177': { floor: 'First Floor', image: 0, x: 46.11, y: 69.95 },
  '1178': { floor: 'First Floor', image: 0, x: 44.79, y: 70.79 },
  '1179': { floor: 'First Floor', image: 0, x: 43.13, y: 71.63 },
  '1180': { floor: 'First Floor', image: 0, x: 41.82, y: 72.48 },
  '1181': { floor: 'First Floor', image: 0, x: 39.37, y: 73.08 },
  '1182': { floor: 'First Floor', image: 0, x: 26, y: 76 },
  '1183': { floor: 'First Floor', image: 0, x: 23, y: 76 },
  '1184': { floor: 'First Floor', image: 0, x: 20, y: 75 },
  '1185': { floor: 'First Floor', image: 0, x: 43.57, y: 83.41 },
  '1188': { floor: 'First Floor', image: 0, x: 40.33, y: 94.83 },
  '1189': { floor: 'First Floor', image: 0, x: 37.53, y: 83.65 },
  '1191': { floor: 'First Floor', image: 0, x: 33.77, y: 80.05 },
  '1192': { floor: 'First Floor', image: 0, x: 34.38, y: 73.08 },
  '1193': { floor: 'First Floor', image: 0, x: 19, y: 67 }, // Blue dot (water)
  '1195': { floor: 'First Floor', image: 0, x: 27.38, y: 69.59 },
  '1196': { floor: 'First Floor', image: 0, x: 26.86, y: 71.51 },
  '1197': { floor: 'First Floor', image: 0, x: 25.02, y: 76.56 },
  '1198': { floor: 'First Floor', image: 0, x: 25.63, y: 68.51 },
  '1199': { floor: 'First Floor', image: 0, x: 21.87, y: 82.69 },

  // SOUTHWEST area - from CMU1st.jpg
  '1190': { floor: 'First Floor', image: 0, x: 33.68, y: 87.38 },
  '1200': { floor: 'First Floor', image: 0, x: 19.77, y: 76.44 },
  '1201': { floor: 'First Floor', image: 0, x: 14.26, y: 83.29 },
  '1202': { floor: 'First Floor', image: 0, x: 14.52, y: 73.44 },
  '1203': { floor: 'First Floor', image: 0, x: 23.10, y: 67.43 },
  '1204': { floor: 'First Floor', image: 0, x: 22.05, y: 65.99 },
  '1205': { floor: 'First Floor', image: 0, x: 20.82, y: 64.66 },
  '1206': { floor: 'First Floor', image: 0, x: 19.77, y: 62.50 },
  '1207': { floor: 'First Floor', image: 0, x: 18.63, y: 60.82 },
  '1208': { floor: 'First Floor', image: 0, x: 18.02, y: 59.02 },

  // Additional CENTER rooms - from H2
  '1220': { floor: 'First Floor', image: 0, x: 15, y: 48 },
  '1218': { floor: 'First Floor', image: 0, x: 15, y: 44 },
  '1142': { floor: 'First Floor', image: 0, x: 60, y: 48 },

  '1243': { floor: 'First Floor', image: 0, x: 14.96, y: 28.49 },
  '1221': { floor: 'First Floor', image: 0, x: 22, y: 50 },
  '1222': { floor: 'First Floor', image: 0, x: 19, y: 52 },
  '1223': { floor: 'First Floor', image: 0, x: 16, y: 54 },
  '1224': { floor: 'First Floor', image: 0, x: 13, y: 56 },
  '1228': { floor: 'First Floor', image: 0, x: 28, y: 45 },
  '1229': { floor: 'First Floor', image: 0, x: 31, y: 48 },
  '1230': { floor: 'First Floor', image: 0, x: 34, y: 50 },
  '1231': { floor: 'First Floor', image: 0, x: 37, y: 52 },
  '1233': { floor: 'First Floor', image: 0, x: 40, y: 54 },
  '1234': { floor: 'First Floor', image: 0, x: 43, y: 56 },
  '1235': { floor: 'First Floor', image: 0, x: 46, y: 58 },

  // Additional EAST side rooms - from H2
  '1123': { floor: 'First Floor', image: 0, x: 87, y: 38 },
  '1127': { floor: 'First Floor', image: 0, x: 91, y: 35 },
  '1128': { floor: 'First Floor', image: 0, x: 89, y: 32 },
  '1129': { floor: 'First Floor', image: 0, x: 85, y: 40 },
  '1131': { floor: 'First Floor', image: 0, x: 85.65, y: 25.84 },
  '1138': { floor: 'First Floor', image: 0, x: 55, y: 45 },
  '1139': { floor: 'First Floor', image: 0, x: 58, y: 48 },
  '1135': { floor: 'First Floor', image: 0, x: 37, y: 37 },


  // ===== SECOND FLOOR =====
  '2001': { floor: 'Second Floor', image: 1, x: 18.84, y: 4.35 },
  //'2002': { floor: 'Second Floor', image: 1, x: 6.85, y: 15 },
  '2003': { floor: 'Second Floor', image: 1, x: 17, y: 9.41 },
  //'2004': { floor: 'Second Floor', image: 1, x: 6.85, y: 25 },
  '2005': { floor: 'Second Floor', image: 1, x: 17, y: 12.71 },
  '2006': { floor: 'Second Floor', image: 1, x: 17, y: 14.12 },
  '2007': { floor: 'Second Floor', image: 1, x: 17, y: 16.35 },
  '2008': { floor: 'Second Floor', image: 1, x: 17, y: 18.35 },
  '2009': { floor: 'Second Floor', image: 1, x: 17, y: 20.35 },
  '2010': { floor: 'Second Floor', image: 1, x: 17, y: 22.47 },
  '2011': { floor: 'Second Floor', image: 1, x: 17, y: 24.35 },
  '2012': { floor: 'Second Floor', image: 1, x: 17, y: 27.53 },
  '2013': { floor: 'Second Floor', image: 1, x: 18.16, y: 12.24 },
  '2014': { floor: 'Second Floor', image: 1, x: 18.16, y: 14.12 },
  '2015': { floor: 'Second Floor', image: 1, x: 18.16, y: 16.82 },
  '2016': { floor: 'Second Floor', image: 1, x: 18.16, y: 17.71 },
  '2017': { floor: 'Second Floor', image: 1, x: 18.16, y: 16.71 },
  '2018': { floor: 'Second Floor', image: 1, x: 18.16, y: 18.35 },
  '2019': { floor: 'Second Floor', image: 1, x: 18.16, y: 20.47 },
  '2020': { floor: 'Second Floor', image: 1, x: 18.16, y: 22.71 },
  '2021': { floor: 'Second Floor', image: 1, x: 18.16, y: 24.35 },
  '2022': { floor: 'Second Floor', image: 1, x: 18.16, y: 26.71 },
  '2023': { floor: 'Second Floor', image: 1, x: 18.16, y: 28.47 },
  '2024': { floor: 'Second Floor', image: 1, x: 21.85, y: 65 },
  '2025': { floor: 'Second Floor', image: 1, x: 21.78, y: 27.41 },
  '2026': { floor: 'Second Floor', image: 1, x: 20.48, y: 27.53 },
  '2027': { floor: 'Second Floor', image: 1, x: 23.44, y: 27.53 },
  '2028': { floor: 'Second Floor', image: 1, x: 25.48, y: 27.65 },
  '2029': { floor: 'Second Floor', image: 1, x: 29.47, y: 23.29 },
  '2030': { floor: 'Second Floor', image: 1, x: 21.85, y: 20 },
  '2031': { floor: 'Second Floor', image: 1, x: 26.97, y: 17.88 },
  '2032': { floor: 'Second Floor', image: 1, x: 31.85, y: 20 },
  '2033': { floor: 'Second Floor', image: 1, x: 26.78, y: 10.94 },
  '2034': { floor: 'Second Floor', image: 1, x: 31.51, y: 14.24 },
  '2035': { floor: 'Second Floor', image: 1, x: 35.96, y: 11.41 },
  '2036': { floor: 'Second Floor', image: 1, x: 36.85, y: 40 },
  '2037': { floor: 'Second Floor', image: 1, x: 37.44, y: 17.06 },
  '2038': { floor: 'Second Floor', image: 1, x: 34.38, y: 18.71 },
  '2039': { floor: 'Second Floor', image: 1, x: 34.38, y: 20.71 },
  '2040': { floor: 'Second Floor', image: 1, x: 34.38, y: 22.82 },
  '2041': { floor: 'Second Floor', image: 1, x: 34.38, y: 24.71 },
  '2042': { floor: 'Second Floor', image: 1, x: 34.38, y: 26.47 },
  '2043': { floor: 'Second Floor', image: 1, x: 51.85, y: 65 },
  '2044': { floor: 'Second Floor', image: 1, x: 41.24, y: 28.12 },
  '2045': { floor: 'Second Floor', image: 1, x: 41.85, y: 40 },
  '2046': { floor: 'Second Floor', image: 1, x: 43.83, y: 26.94 },
  '2047': { floor: 'Second Floor', image: 1, x: 47.17, y: 26.94 },
  '2048': { floor: 'Second Floor', image: 1, x: 47.35, y: 29.41 },
  '2049': { floor: 'Second Floor', image: 1, x: 45.78, y: 23.76 },
  '2050': { floor: 'Second Floor', image: 1, x: 46.15, y: 19.53 },
  '2051': { floor: 'Second Floor', image: 1, x: 45.96, y: 16.47 },
  '2052': { floor: 'Second Floor', image: 1, x: 45.59, y: 10.82 },
  '2060': { floor: 'Second Floor', image: 1, x: 57.85, y: 20 },
  '2061': { floor: 'Second Floor', image: 1, x: 56.72, y: 20.82 },
  '2062': { floor: 'Second Floor', image: 1, x: 50.87, y: 22.35 },
  '2064': { floor: 'Second Floor', image: 1, x: 56.81, y: 23.41 },
  '2065': { floor: 'Second Floor', image: 1, x: 59.78, y: 22.59 },
  '2066': { floor: 'Second Floor', image: 1, x: 58.11, y: 59.29 },
  '2067': { floor: 'Second Floor', image: 1, x: 56.16, y: 27.65 },
  '2068': { floor: 'Second Floor', image: 1, x: 64.69, y: 26.35 },
  '2069': { floor: 'Second Floor', image: 1, x: 66.73, y: 27.53 },
  '2070': { floor: 'Second Floor', image: 1, x: 65.89, y: 23.53 },
  '2071': { floor: 'Second Floor', image: 1, x: 65.89, y: 21.18 },
  '2072': { floor: 'Second Floor', image: 1, x: 66.17, y: 18.82 },
  '2073': { floor: 'Second Floor', image: 1, x: 66.36, y: 16.82 },
  '2074': { floor: 'Second Floor', image: 1, x: 66.85, y: 45 },
  '2075': { floor: 'Second Floor', image: 1, x: 66.54, y: 14.47 },
  '2076': { floor: 'Second Floor', image: 1, x: 66.64, y: 12.47 },
  '2077': { floor: 'Second Floor', image: 1, x: 66.64, y: 10.24 },
  '2078': { floor: 'Second Floor', image: 1, x: 66.82, y: 7.76 },
  '2079': { floor: 'Second Floor', image: 1, x: 66.54, y: 4.71 },
  '2080': { floor: 'Second Floor', image: 1, x: 46.85, y: 20 },
  '2081': { floor: 'Second Floor', image: 1, x: 75.53, y: 4.35 },
  '2082': { floor: 'Second Floor', image: 1, x: 77.48, y: 4.35 },
  '2083': { floor: 'Second Floor', image: 1, x: 78.96, y: 4.35 },
  '2084': { floor: 'Second Floor', image: 1, x: 80.63, y: 63.18 },
  '2085': { floor: 'Second Floor', image: 1, x: 80, y: 4.35 },
  '2086': { floor: 'Second Floor', image: 1, x: 74, y: 8 },
  '2053': { floor: 'Second Floor', image: 1, x: 76.85, y: 10 },
  '2054': { floor: 'Second Floor', image: 1, x: 79.85, y: 10 },
  '2055': { floor: 'Second Floor', image: 1, x: 82.85, y: 10 },
  '2056': { floor: 'Second Floor', image: 1, x: 85.85, y: 10 },
  '2057': { floor: 'Second Floor', image: 1, x: 52.36, y: 18.24 },
  '2058': { floor: 'Second Floor', image: 1, x: 56.44, y: 18.12 },
  '2059': { floor: 'Second Floor', image: 1, x: 55.46, y: 12.12 },
  '2087': { floor: 'Second Floor', image: 1, x: 76.85, y: 25 },
  '2088': { floor: 'Second Floor', image: 1, x: 77.39, y: 10.00 },
  '2089': { floor: 'Second Floor', image: 1, x: 78.78, y: 9.29 },
  '2090': { floor: 'Second Floor', image: 1, x: 76.85, y: 35 },
  '2091': { floor: 'Second Floor', image: 1, x: 76.85, y: 40 },
  '2093': { floor: 'Second Floor', image: 1, x: 81.85, y: 25 },
  '2094': { floor: 'Second Floor', image: 1, x: 81.85, y: 30 },
  '2095': { floor: 'Second Floor', image: 1, x: 81.85, y: 35 },
  '2096': { floor: 'Second Floor', image: 1, x: 82.85, y: 10},
  '2098': { floor: 'Second Floor', image: 1, x: 86, y: 5 },
  '2099': { floor: 'Second Floor', image: 1, x: 90, y: 18.82 },
  '2100': { floor: 'Second Floor', image: 1, x: 86.85, y: 18 },
  '2101': { floor: 'Second Floor', image: 1, x: 87.85, y: 20 },
  '2102': { floor: 'Second Floor', image: 1, x: 88.85, y: 22 },
  '2103': { floor: 'Second Floor', image: 1, x: 83.85, y: 15 },
  '2104': { floor: 'Second Floor', image: 1, x: 85.85, y: 14 },
  '2106': { floor: 'Second Floor', image: 1, x: 84.85, y: 40 },
  '2107': { floor: 'Second Floor', image: 1, x: 83.85, y: 20 },
  '2108': { floor: 'Second Floor', image: 1, x: 84.85, y: 22 },
  '2109': { floor: 'Second Floor', image: 1, x: 87.5, y: 14.12 },
  '2110': { floor: 'Second Floor', image: 1, x: 87.5, y: 16.59 },
  '2111': { floor: 'Second Floor', image: 1, x: 87.5, y: 18.94 },
  '2112': { floor: 'Second Floor', image: 1, x: 87.5, y: 21.29 },
  '2113': { floor: 'Second Floor', image: 1, x: 89.43, y: 22.82 },
  '2114': { floor: 'Second Floor', image: 1, x: 85.86, y: 22.47 },
  '2115': { floor: 'Second Floor', image: 1, x: 87.5, y: 24.71 },
  '2116': { floor: 'Second Floor', image: 1, x: 85.14, y: 25.18 },
  '2117': { floor: 'Second Floor', image: 1, x: 90.55, y: 28.12 },
  '2118': { floor: 'Second Floor', image: 1, x: 90.35, y: 30.00 },
  '2119': { floor: 'Second Floor', image: 1, x: 86.47, y: 30.00 },
  '2120': { floor: 'Second Floor', image: 1, x: 83.16, y: 30.00 },
  '2121': { floor: 'Second Floor', image: 1, x: 86.56, y: 30.00 },
  '2122': { floor: 'Second Floor', image: 1, x: 83.50, y: 30.00 },
  '2123': { floor: 'Second Floor', image: 1, x: 80.37, y: 30.00 },
  '2124': { floor: 'Second Floor', image: 1, x: 91.85, y: 45 },
  '2125': { floor: 'Second Floor', image: 1, x: 89.85, y: 42 },
  '2126': { floor: 'Second Floor', image: 1, x: 86.85, y: 48 },
  '2127': { floor: 'Second Floor', image: 1, x: 93.85, y: 43 },
  '2128': { floor: 'Second Floor', image: 1, x: 52.92, y: 46.71 },
  '2129': { floor: 'Second Floor', image: 1, x: 59.22, y: 43.76 },
  '2134': { floor: 'Second Floor', image: 1, x: 66.27, y: 44.12 },
  '2135': { floor: 'Second Floor', image: 1, x: 71.00, y: 44.24 },
  '2136': { floor: 'Second Floor', image: 1, x: 69.32, y: 48.82 },
  '2138': { floor: 'Second Floor', image: 1, x: 74.48, y: 45.88 },
  '2139': { floor: 'Second Floor', image: 1, x: 87.85, y: 58 },
  '2140': { floor: 'Second Floor', image: 1, x: 63.76, y: 52.00 },
  '2141': { floor: 'Second Floor', image: 1, x: 60.80, y: 48.59 },
  '2142': { floor: 'Second Floor', image: 1, x: 60.24, y: 53.06 },
  '2143': { floor: 'Second Floor', image: 1, x: 59.78, y: 55.29 },
  '2144': { floor: 'Second Floor', image: 1, x: 58.85, y: 57.18 },
  '2145': { floor: 'Second Floor', image: 1, x: 57.18, y: 61.18 },
  '2146': { floor: 'Second Floor', image: 1, x: 62.28, y: 63.65 },
  '2147': { floor: 'Second Floor', image: 1, x: 66.73, y: 67.41 },
  '2148': { floor: 'Second Floor', image: 1, x: 63.21, y: 70.82 },
  '2151': { floor: 'Second Floor', image: 1, x: 66.45, y: 77.53 },
  '2152': { floor: 'Second Floor', image: 1, x: 58.39, y: 75.88 },
  '2153': { floor: 'Second Floor', image: 1, x: 55.33, y: 64.59 },
  '2154': { floor: 'Second Floor', image: 1, x: 53.57, y: 66.12 },
  '2155': { floor: 'Second Floor', image: 1, x: 52.46, y: 67.65 },
  '2156': { floor: 'Second Floor', image: 1, x: 51.16, y: 68.82 },
  '2157': { floor: 'Second Floor', image: 1, x: 49.40, y: 70.00 },
  '2158': { floor: 'Second Floor', image: 1, x: 48.01, y: 70.82 },
  '2159': { floor: 'Second Floor', image: 1, x: 46.34, y: 71.65 },
  '2160': { floor: 'Second Floor', image: 1, x: 44.76, y: 72.94 },
  '2161': { floor: 'Second Floor', image: 1, x: 42.08, y: 73.29 },
  '2163': { floor: 'Second Floor', image: 1, x: 47.17, y: 83.06 },
  '2164': { floor: 'Second Floor', image: 1, x: 79.85, y: 20 },
  '2165': { floor: 'Second Floor', image: 1, x: 87.85, y: 28 },
  '2167': { floor: 'Second Floor', image: 1, x: 61.85, y: 60 },
  '2169': { floor: 'Second Floor', image: 1, x: 36.42, y: 79.53 },
  '2170': { floor: 'Second Floor', image: 1, x: 37.16, y: 73.18 },
  '2171': { floor: 'Second Floor', image: 1, x: 66.85, y: 71 },
  '2172': { floor: 'Second Floor', image: 1, x: 34.29, y: 73.18 },
  '2173': { floor: 'Second Floor', image: 1, x: 32.44, y: 72.47 },
  '2174': { floor: 'Second Floor', image: 1, x: 30.68, y: 71.53 },
  '2175': { floor: 'Second Floor', image: 1, x: 28.45, y: 71.53 },
  '2176': { floor: 'Second Floor', image: 1, x: 29.10, y: 69.41 },
  '2177': { floor: 'Second Floor', image: 1, x: 26.50, y: 75.65 },
  '2178': { floor: 'Second Floor', image: 1, x: 36.85, y: 85 },
  '2179': { floor: 'Second Floor', image: 1, x: 21.31, y: 82.94 },
  '2180': { floor: 'Second Floor', image: 1, x: 33.85, y: 87 },
  '2181': { floor: 'Second Floor', image: 1, x: 30.85, y: 88 },
  '2182': { floor: 'Second Floor', image: 1, x: 16.03, y: 76.82 },
  '2183': { floor: 'Second Floor', image: 1, x: 13.62, y: 73.29 },
  '2184': { floor: 'Second Floor', image: 1, x: 16.12, y: 70.59 },
  '2185': { floor: 'Second Floor', image: 1, x: 18.72, y: 73.65 },
  '2187': { floor: 'Second Floor', image: 1, x: 25.21, y: 67.18 },
  '2188': { floor: 'Second Floor', image: 1, x: 23.44, y: 65.88 },
  '2189': { floor: 'Second Floor', image: 1, x: 22.42, y: 70.47 },
  '2190': { floor: 'Second Floor', image: 1, x: 21.22, y: 62.82 },
  '2191': { floor: 'Second Floor', image: 1, x: 20.29, y: 61.18 },
  '2192': { floor: 'Second Floor', image: 1, x: 19.18, y: 59.29 },
  '2193': { floor: 'Second Floor', image: 1, x: 18.72, y: 57.29 },
  '2194': { floor: 'Second Floor', image: 1, x: 18.07, y: 55.18 },
  '2195': { floor: 'Second Floor', image: 1, x: 17.42, y: 52.82 },
  '2196': { floor: 'Second Floor', image: 1, x: 10.47, y: 57.88 },
  '2197': { floor: 'Second Floor', image: 1, x: 11.85, y: 81 },
  '2198': { floor: 'Second Floor', image: 1, x: 7.13, y: 60.47 },
  '2199': { floor: 'Second Floor', image: 1, x: 12.32, y: 62.24 },
  '2200': { floor: 'Second Floor', image: 1, x: 16.85, y: 76 },
  '2201': { floor: 'Second Floor', image: 1, x: 14.85, y: 74 },
  '2202': { floor: 'Second Floor', image: 1, x: 12.85, y: 72 },
  '2203': { floor: 'Second Floor', image: 1, x: 10.85, y: 70 },
  '2204': { floor: 'Second Floor', image: 1, x: 6.58, y: 50.00 },
  '2205': { floor: 'Second Floor', image: 1, x: 5.93, y: 45.53 },
  '2206': { floor: 'Second Floor', image: 1, x: 6.85, y: 64 },
  '2207': { floor: 'Second Floor', image: 1, x: 5.85, y: 62 },
  '2208': { floor: 'Second Floor', image: 1, x: 4.85, y: 60 },
  '2217': { floor: 'Second Floor', image: 1, x: 33.92, y: 51.65 },
  '2220': { floor: 'Second Floor', image: 1, x: 26.85, y: 58 },
  '2221': { floor: 'Second Floor', image: 1, x: 23.85, y: 60 },
  '2222': { floor: 'Second Floor', image: 1, x: 39.94, y: 66.59 },
  '2223': { floor: 'Second Floor', image: 1, x: 72.70, y: 53.29 },
  '2224': { floor: 'Second Floor', image: 1, x: 72.10, y: 55.76 },
  '2242': { floor: 'Second Floor', image: 1, x: 68.86, y: 4.35 },
  '2243': { floor: 'Second Floor', image: 1, x: 69.42, y: 4.35 },
  '2244': { floor: 'Second Floor', image: 1, x: 73.59, y: 4.35 },
  '2301': { floor: 'Second Floor', image: 1, x: 94.81, y: 11.65 },

  // ===== THIRD FLOOR =====
  // Image dimensions: 1136 × 821 px
  '3001': { floor: 'Third Floor', image: 2, x: 15.14, y: 2.92 },  // 172,24
  '3002': { floor: 'Third Floor', image: 2, x: 16.90, y: 5.24 },  // 192,43
  '3003': { floor: 'Third Floor', image: 2, x: 12.24, y: 8.65 },  // 139,71
  '3004': { floor: 'Third Floor', image: 2, x: 13.47, y: 8.77 },  // 153,72
  '3005': { floor: 'Third Floor', image: 2, x: 15.23, y: 6.82 },  // 173,56
  '3006': { floor: 'Third Floor', image: 2, x: 16.29, y: 6.70 },  // 185,55
  '3007': { floor: 'Third Floor', image: 2, x: 17.78, y: 7.06 },  // 202,58
  '3008': { floor: 'Third Floor', image: 2, x: 17.17, y: 25.33 },  // 195,208
  '3009': { floor: 'Third Floor', image: 2, x: 17.25, y: 27.28 },  // 196,224
  '3010': { floor: 'Third Floor', image: 2, x: 21.92, y: 26.43 },  // 249,217
  '3012': { floor: 'Third Floor', image: 2, x: 27.11, y: 23.02 },  // 308,189
  '3013': { floor: 'Third Floor', image: 2, x: 24.56, y: 17.42 },  // 279,143
  '3014': { floor: 'Third Floor', image: 2, x: 16.37, y: 9.50 },  // 186,78
  '3016': { floor: 'Third Floor', image: 2, x: 17.78, y: 10.60 },  // 202,87
  '3018': { floor: 'Third Floor', image: 2, x: 50.62, y: 9.01 },  // 575,74
  '3020': { floor: 'Third Floor', image: 2, x: 32.22, y: 27.65 },  // 366,227
  '3021': { floor: 'Third Floor', image: 2, x: 39.35, y: 27.16 },  // 447,223
  '3022': { floor: 'Third Floor', image: 2, x: 41.37, y: 25.70 },  // 470,211
  '3023': { floor: 'Third Floor', image: 2, x: 44.54, y: 25.33 },  // 506,208
  '3024': { floor: 'Third Floor', image: 2, x: 45.16, y: 28.26 },  // 513,232
  '3025': { floor: 'Third Floor', image: 2, x: 42.87, y: 19.73 },  // 487,162
  '3026': { floor: 'Third Floor', image: 2, x: 42.96, y: 13.64 },  // 488,112
  '3027': { floor: 'Third Floor', image: 2, x: 43.49, y: 9.62 },  // 494,79
  '3030': { floor: 'Third Floor', image: 2, x: 51.14, y: 13.28 },  // 581,109
  '3031': { floor: 'Third Floor', image: 2, x: 50.35, y: 14.37 },  // 572,118
  '3032': { floor: 'Third Floor', image: 2, x: 54.67, y: 10.35 },  // 621,85
  '3033': { floor: 'Third Floor', image: 2, x: 52.91, y: 16.57 },  // 601,136
  '3034': { floor: 'Third Floor', image: 2, x: 49.38, y: 16.44 },  // 561,135
  '3035': { floor: 'Third Floor', image: 2, x: 52.20, y: 23.14 },  // 593,190
  '3036': { floor: 'Third Floor', image: 2, x: 68.84, y: 19.61 },  // 782,161
  '3041': { floor: 'Third Floor', image: 2, x: 60.83, y: 43.48 },  // 691,357
  '3042': { floor: 'Third Floor', image: 2, x: 60.56, y: 47.75 },  // 688,392
  '3043': { floor: 'Third Floor', image: 2, x: 66.11, y: 45.31 },  // 751,372
  '3044': { floor: 'Third Floor', image: 2, x: 66.29, y: 50.67 },  // 753,416
  '3046': { floor: 'Third Floor', image: 2, x: 61.00, y: 71.01 },  // 693,583
  '3047': { floor: 'Third Floor', image: 2, x: 58.80, y: 62.48 },  // 668,513
  '3048': { floor: 'Third Floor', image: 2, x: 63.73, y: 66.38 },  // 724,545
  '3054': { floor: 'Third Floor', image: 2, x: 41.81, y: 71.86 },  // 475,590
  '3055': { floor: 'Third Floor', image: 2, x: 30.72, y: 21.31 },  // 349,175
  '3061': { floor: 'Third Floor', image: 2, x: 34.59, y: 80.02 },  // 393,657
  '3062': { floor: 'Third Floor', image: 2, x: 34.77, y: 72.84 },  // 395,598
  '3063': { floor: 'Third Floor', image: 2, x: 27.90, y: 68.57 },  // 317,563
  '3064': { floor: 'Third Floor', image: 2, x: 27.29, y: 70.89 },  // 310,582
  '3065': { floor: 'Third Floor', image: 2, x: 25.44, y: 76.86 },  // 289,631
  '3069': { floor: 'Third Floor', image: 2, x: 17.08, y: 71.38 },  // 194,586
  '3076': { floor: 'Third Floor', image: 2, x: 6.69, y: 44.58 },  // 76,366
  '3077': { floor: 'Third Floor', image: 2, x: 11.71, y: 43.85 },  // 133,360
  '3078': { floor: 'Third Floor', image: 2, x: 12.50, y: 47.62 },  // 142,391
  '3079': { floor: 'Third Floor', image: 2, x: 16.81, y: 52.50 },  // 191,431
  '3080': { floor: 'Third Floor', image: 2, x: 15.67, y: 43.61 },  // 178,358
  '3081': { floor: 'Third Floor', image: 2, x: 15.49, y: 46.04 },  // 176,378
  '3082': { floor: 'Third Floor', image: 2, x: 15.76, y: 48.11 },  // 179,395
  '3083': { floor: 'Third Floor', image: 2, x: 17.08, y: 12.91 },  // 194,106
  '3088': { floor: 'Third Floor', image: 2, x: 17.43, y: 14.98 },  // 198,123
  '3090': { floor: 'Third Floor', image: 2, x: 17.78, y: 16.81 },  // 202,138
  '3091': { floor: 'Third Floor', image: 2, x: 17.69, y: 19.24 },  // 201,158
  '3092': { floor: 'Third Floor', image: 2, x: 17.87, y: 21.92 },  // 203,180
  '3093': { floor: 'Third Floor', image: 2, x: 27.46, y: 14.98 },  // 312,123
  '3094': { floor: 'Third Floor', image: 2, x: 15.32, y: 22.41 },  // 174,184
  '3095': { floor: 'Third Floor', image: 2, x: 57.48, y: 47.50 },  // 653,390
  '3097': { floor: 'Third Floor', image: 2, x: 52.64, y: 18.15 },  // 598,149
  '3101': { floor: 'Third Floor', image: 2, x: 27.55, y: 66.99 },  // 313,550
  '3103': { floor: 'Third Floor', image: 2, x: 51.23, y: 17.05 },  // 582,140
  '3104': { floor: 'Third Floor', image: 2, x: 51.23, y: 17.05 },  // 582,140
  '3105': { floor: 'Third Floor', image: 2, x: 16.02, y: 27.65 },  // 182,227
  '3107': { floor: 'Third Floor', image: 2, x: 57.39, y: 43.00 },  // 652,353
  '3108': { floor: 'Third Floor', image: 2, x: 38.47, y: 25.21 },  // 437,207
  '3109': { floor: 'Third Floor', image: 2, x: 12.59, y: 28.87 },  // 143,237
  '3110': { floor: 'Third Floor', image: 2, x: 12.59, y: 25.82 },  // 143,212
  '3111': { floor: 'Third Floor', image: 2, x: 12.59, y: 23.14 },  // 143,190
  '3112': { floor: 'Third Floor', image: 2, x: 12.59, y: 20.95 },  // 143,172
  '3113': { floor: 'Third Floor', image: 2, x: 12.59, y: 19.24 },  // 143,158
  '3114': { floor: 'Third Floor', image: 2, x: 12.59, y: 17.17 },  // 143,141
  '3115': { floor: 'Third Floor', image: 2, x: 12.59, y: 15.10 },  // 143,124
  '3116': { floor: 'Third Floor', image: 2, x: 12.59, y: 13.15 },  // 143,108
  '3117': { floor: 'Third Floor', image: 2, x: 12.59, y: 10.96 },  // 143,90
  '3118': { floor: 'Third Floor', image: 2, x: 15.14, y: 13.15 },  // 172,108
  '3121': { floor: 'Third Floor', image: 2, x: 15.41, y: 19.00 },  // 175,156
  '3122': { floor: 'Third Floor', image: 2, x: 24.03, y: 26.67 },  // 273,219
  '3123': { floor: 'Third Floor', image: 2, x: 24.30, y: 13.03 },  // 276,107
  '3124': { floor: 'Third Floor', image: 2, x: 24.30, y: 12.67 },  // 276,104
  '3125': { floor: 'Third Floor', image: 2, x: 24.30, y: 12.55 },  // 276,103
  '3126': { floor: 'Third Floor', image: 2, x: 24.30, y: 8.77 },  // 276,72
  '3127': { floor: 'Third Floor', image: 2, x: 26.67, y: 7.31 },  // 303,60
  '3128': { floor: 'Third Floor', image: 2, x: 27.20, y: 9.87 },  // 309,81
  '3129': { floor: 'Third Floor', image: 2, x: 29.93, y: 11.57 },  // 340,95
  '3130': { floor: 'Third Floor', image: 2, x: 33.80, y: 12.67 },  // 384,104
  '3131': { floor: 'Third Floor', image: 2, x: 68.13, y: 11.81 },  // 774,97
  '3132': { floor: 'Third Floor', image: 2, x: 32.92, y: 9.38 },  // 374,77
  '3133': { floor: 'Third Floor', image: 2, x: 33.10, y: 7.43 },  // 376,61
  '3134': { floor: 'Third Floor', image: 2, x: 35.83, y: 7.55 },  // 407,62
  '3135': { floor: 'Third Floor', image: 2, x: 35.56, y: 9.87 },  // 404,81
  '3136': { floor: 'Third Floor', image: 2, x: 36.88, y: 12.79 },  // 419,105
  '3137': { floor: 'Third Floor', image: 2, x: 32.83, y: 17.17 },  // 373,141
  '3138': { floor: 'Third Floor', image: 2, x: 33.10, y: 19.24 },  // 376,158
  '3139': { floor: 'Third Floor', image: 2, x: 33.19, y: 21.19 },  // 377,174
  '3144': { floor: 'Third Floor', image: 2, x: 48.42, y: 25.94 },  // 550,213
  '3146': { floor: 'Third Floor', image: 2, x: 60.13, y: 29.35 },  // 683,241
  '3148': { floor: 'Third Floor', image: 2, x: 57.13, y: 26.07 },  // 649,214
  '3149': { floor: 'Third Floor', image: 2, x: 56.87, y: 24.24 },  // 646,199
  '3150': { floor: 'Third Floor', image: 2, x: 56.60, y: 22.29 },  // 643,183
  '3151': { floor: 'Third Floor', image: 2, x: 56.16, y: 19.61 },  // 638,161
  '3152': { floor: 'Third Floor', image: 2, x: 54.75, y: 17.30 },  // 622,142
  '3153': { floor: 'Third Floor', image: 2, x: 55.99, y: 16.69 },  // 636,137
  '3154': { floor: 'Third Floor', image: 2, x: 59.33, y: 25.21 },  // 674,207
  '3155': { floor: 'Third Floor', image: 2, x: 62.41, y: 22.17 },  // 709,182
  '3156': { floor: 'Third Floor', image: 2, x: 62.68, y: 19.85 },  // 712,163
  '3157': { floor: 'Third Floor', image: 2, x: 62.94, y: 17.54 },  // 715,144
  '3158': { floor: 'Third Floor', image: 2, x: 64.17, y: 19.37 },  // 729,159
  '3159': { floor: 'Third Floor', image: 2, x: 65.05, y: 20.22 },  // 739,166
  '3160': { floor: 'Third Floor', image: 2, x: 64.17, y: 15.47 },  // 729,127
  '3161': { floor: 'Third Floor', image: 2, x: 63.73, y: 19.85 },  // 724,163
  '3162': { floor: 'Third Floor', image: 2, x: 64.00, y: 9.74 },  // 727,80
  '3163': { floor: 'Third Floor', image: 2, x: 64.35, y: 7.43 },  // 731,61
  '3164': { floor: 'Third Floor', image: 2, x: 66.64, y: 7.67 },  // 757,63
  '3165': { floor: 'Third Floor', image: 2, x: 67.87, y: 8.77 },  // 771,72
  '3166': { floor: 'Third Floor', image: 2, x: 70.25, y: 7.19 },  // 798,59
  '3167': { floor: 'Third Floor', image: 2, x: 70.77, y: 9.99 },  // 804,82
  '3168': { floor: 'Third Floor', image: 2, x: 66.29, y: 10.84 },  // 753,89
  '3169': { floor: 'Third Floor', image: 2, x: 67.08, y: 13.03 },  // 762,107
  '3170': { floor: 'Third Floor', image: 2, x: 66.99, y: 14.74 },  // 761,121
  '3171': { floor: 'Third Floor', image: 2, x: 69.19, y: 14.50 },  // 786,119
  '3172': { floor: 'Third Floor', image: 2, x: 71.13, y: 13.89 },  // 808,114
  '3173': { floor: 'Third Floor', image: 2, x: 70.42, y: 16.32 },  // 800,134
  '3174': { floor: 'Third Floor', image: 2, x: 62.15, y: 29.35 },  // 706,241
  '3175': { floor: 'Third Floor', image: 2, x: 64.35, y: 29.35 },  // 731,241
  '3176': { floor: 'Third Floor', image: 2, x: 66.46, y: 29.35 },  // 755,241
  '3177': { floor: 'Third Floor', image: 2, x: 68.57, y: 29.35 },  // 779,241
  '3178': { floor: 'Third Floor', image: 2, x: 6.78, y: 53.84 },  // 77,442
  '3179': { floor: 'Third Floor', image: 2, x: 17.17, y: 54.33 },  // 195,446
  '3180': { floor: 'Third Floor', image: 2, x: 17.87, y: 56.27 },  // 203,462
  '3181': { floor: 'Third Floor', image: 2, x: 18.40, y: 58.71 },  // 209,482
  '3182': { floor: 'Third Floor', image: 2, x: 19.28, y: 60.66 },  // 219,498
  '3183': { floor: 'Third Floor', image: 2, x: 20.42, y: 62.12 },  // 232,510
  '3184': { floor: 'Third Floor', image: 2, x: 21.21, y: 63.83 },  // 241,524
  '3185': { floor: 'Third Floor', image: 2, x: 22.45, y: 65.41 },  // 255,537
  '3186': { floor: 'Third Floor', image: 2, x: 23.68, y: 67.11 },  // 269,551
  '3187': { floor: 'Third Floor', image: 2, x: 29.40, y: 71.50 },  // 334,587
  '3188': { floor: 'Third Floor', image: 2, x: 30.99, y: 72.11 },  // 352,592
  '3189': { floor: 'Third Floor', image: 2, x: 32.57, y: 72.72 },  // 370,597
  '3190': { floor: 'Third Floor', image: 2, x: 38.91, y: 72.96 },  // 442,599
  '3191': { floor: 'Third Floor', image: 2, x: 44.01, y: 71.74 },  // 500,589
  '3192': { floor: 'Third Floor', image: 2, x: 45.42, y: 70.77 },  // 516,581
  '3193': { floor: 'Third Floor', image: 2, x: 46.74, y: 69.67 },  // 531,572
  '3194': { floor: 'Third Floor', image: 2, x: 48.15, y: 68.33 },  // 547,561
  '3195': { floor: 'Third Floor', image: 2, x: 49.47, y: 66.87 },  // 562,549
  '3196': { floor: 'Third Floor', image: 2, x: 50.53, y: 65.65 },  // 574,539
  '3197': { floor: 'Third Floor', image: 2, x: 51.67, y: 64.31 },  // 587,528
  '3198': { floor: 'Third Floor', image: 2, x: 53.79, y: 60.78 },  // 611,499
  '3199': { floor: 'Third Floor', image: 2, x: 54.84, y: 58.71 },  // 623,482
  '3200': { floor: 'Third Floor', image: 2, x: 55.28, y: 56.52 },  // 628,464
  '3201': { floor: 'Third Floor', image: 2, x: 56.25, y: 54.69 },  // 639,449
  '3202': { floor: 'Third Floor', image: 2, x: 56.34, y: 52.25 },  // 640,429
  '3203': { floor: 'Third Floor', image: 2, x: 62.94, y: 55.30 },  // 715,454
  '3204': { floor: 'Third Floor', image: 2, x: 66.29, y: 55.30 },  // 753,454
  '3205': { floor: 'Third Floor', image: 2, x: 57.22, y: 69.31 },  // 650,569
  '3206': { floor: 'Third Floor', image: 2, x: 38.12, y: 87.33 },  // 433,717
  '3207': { floor: 'Third Floor', image: 2, x: 38.03, y: 83.44 },  // 432,685
  '3208': { floor: 'Third Floor', image: 2, x: 22.09, y: 76.98 },  // 251,632
  '3209': { floor: 'Third Floor', image: 2, x: 19.98, y: 78.08 },  // 227,641
  '3210': { floor: 'Third Floor', image: 2, x: 18.66, y: 80.63 },  // 212,662
  '3211': { floor: 'Third Floor', image: 2, x: 8.80, y: 64.56 },  // 100,530
  '3212': { floor: 'Third Floor', image: 2, x: 12.15, y: 61.27 },  // 138,503
  '3213': { floor: 'Third Floor', image: 2, x: 11.62, y: 59.20 },  // 132,486
  '3214': { floor: 'Third Floor', image: 2, x: 11.09, y: 57.25 },  // 126,470
  '3215': { floor: 'Third Floor', image: 2, x: 10.39, y: 54.81 },  // 118,450
  '3220': { floor: 'Third Floor', image: 2, x: 29.75, y: 13.76 },  // 338,113
  '3221': { floor: 'Third Floor', image: 2, x: 29.14, y: 14.86 },  // 331,122
  '3222': { floor: 'Third Floor', image: 2, x: 48.24, y: 20.95 },  // 548,172
  '3224': { floor: 'Third Floor', image: 2, x: 19.54, y: 25.33 },  // 222,208
  '3225': { floor: 'Third Floor', image: 2, x: 19.54, y: 27.16 },  // 222,223

};

export const FLOOR_NAMES = ['First Floor', 'Second Floor', 'Third Floor'];
