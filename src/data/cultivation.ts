export type RealmRank = "common" | "uncommon" | "rare" | "epic" | "legend" | "myth";

export interface Realm {
  id: string;
  name: string;
  vietName: string;
  level: number;
  description: string;
  rank: RealmRank;
}

export const realms: Realm[] = [
  { id: "luyen-khi", name: "練氣", vietName: "Luyện Khí", level: 1, description: "Hấp thu linh khí trời đất, mở thông kinh mạch.", rank: "common" },
  { id: "truc-co", name: "築基", vietName: "Trúc Cơ", level: 2, description: "Tạo dựng nền tảng tu vi, ngưng tụ linh nguyên.", rank: "uncommon" },
  { id: "kim-dan", name: "金丹", vietName: "Kim Đan", level: 3, description: "Ngưng kết kim đan trong đan điền, thọ mệnh tăng vọt.", rank: "rare" },
  { id: "nguyen-anh", name: "元嬰", vietName: "Nguyên Anh", level: 4, description: "Phá đan thành anh, nguyên thần xuất khiếu.", rank: "epic" },
  { id: "hoa-than", name: "化神", vietName: "Hoá Thần", level: 5, description: "Dung hợp pháp tắc, thân hoá vạn vật.", rank: "epic" },
  { id: "luyen-hu", name: "煉虛", vietName: "Luyện Hư", level: 6, description: "Luyện hư hợp đạo, lĩnh ngộ thiên cơ.", rank: "legend" },
  { id: "hop-the", name: "合體", vietName: "Hợp Thể", level: 7, description: "Thiên nhân hợp nhất, sức mạnh kinh thiên.", rank: "legend" },
  { id: "dai-thua", name: "大乘", vietName: "Đại Thừa", level: 8, description: "Đứng đầu nhân giới, một bước phi thăng.", rank: "myth" },
  { id: "do-kiep", name: "渡劫", vietName: "Độ Kiếp", level: 9, description: "Vượt qua chín chín tám mốt thiên kiếp, bước vào tiên giới.", rank: "myth" },
];

export interface Technique {
  id: string;
  name: string;
  vietName: string;
  attribute: string;
  rank: RealmRank;
  description: string;
  origin: string;
}

export const techniques: Technique[] = [
  { id: "1", name: "青冥劍訣", vietName: "Thanh Minh Kiếm Quyết", attribute: "Kiếm · Mộc", rank: "legend", description: "Mượn linh khí thảo mộc, kiếm khí xanh biếc trảm thiên.", origin: "Thanh Vân Tông" },
  { id: "2", name: "九轉金身", vietName: "Cửu Chuyển Kim Thân", attribute: "Thân · Kim", rank: "myth", description: "Chín lần luyện thể, thân thể bất hoại như kim cương.", origin: "Phật Môn cổ tịch" },
  { id: "3", name: "御風訣", vietName: "Ngự Phong Quyết", attribute: "Phong · Khinh công", rank: "rare", description: "Cưỡi gió mà đi, bước chân nhẹ tựa hồng mao.", origin: "Tiêu Dao Phái" },
  { id: "4", name: "玄冰心經", vietName: "Huyền Băng Tâm Kinh", attribute: "Băng · Thuỷ", rank: "epic", description: "Tâm như băng tuyết, vạn pháp bất xâm.", origin: "Bắc Hải Tiên Cung" },
  { id: "5", name: "焚天訣", vietName: "Phần Thiên Quyết", attribute: "Hoả · Công kích", rank: "epic", description: "Một đạo hoả diễm thiêu cháy chín tầng trời.", origin: "Hoả Vân Cốc" },
  { id: "6", name: "太一神數", vietName: "Thái Ất Thần Số", attribute: "Đạo · Suy diễn", rank: "myth", description: "Suy diễn thiên cơ, biết trước hung cát.", origin: "Vô danh đạo nhân" },
];

export interface Treasure {
  id: string;
  name: string;
  vietName: string;
  type: "Pháp Bảo" | "Linh Thú" | "Đan Dược" | "Pháp Khí";
  rank: RealmRank;
  description: string;
}

export const treasures: Treasure[] = [
  { id: "1", name: "青鋒劍", vietName: "Thanh Phong Kiếm", type: "Pháp Bảo", rank: "legend", description: "Cổ kiếm ngàn năm, kiếm khí xanh biếc xuyên thiên." },
  { id: "2", name: "九尾靈狐", vietName: "Cửu Vĩ Linh Hồ", type: "Linh Thú", rank: "myth", description: "Linh thú thượng cổ, tinh thông huyễn thuật mê người." },
  { id: "3", name: "返魂丹", vietName: "Phản Hồn Đan", type: "Đan Dược", rank: "epic", description: "Cải tử hoàn sinh, một viên cứu một mạng." },
  { id: "4", name: "乾坤袋", vietName: "Càn Khôn Đại", type: "Pháp Khí", rank: "rare", description: "Bên trong chứa một thế giới, cất giữ vạn vật." },
  { id: "5", name: "玄武甲", vietName: "Huyền Vũ Giáp", type: "Pháp Bảo", rank: "epic", description: "Giáp trụ cổ xưa hoá từ vảy huyền vũ thần thú." },
  { id: "6", name: "白鶴童子", vietName: "Bạch Hạc Đồng Tử", type: "Linh Thú", rank: "rare", description: "Hạc tiên thông linh, cưỡi mây vượt vạn dặm." },
];

export interface Cultivator {
  id: string;
  name: string;
  realm: string;
  sect: string;
  power: number;
  dharma: string;
}

export const cultivators: Cultivator[] = [
  { id: "1", name: "Lăng Vân Tử", realm: "Độ Kiếp", sect: "Thanh Vân Tông", power: 99800, dharma: "Cửu Long Pháp Tướng" },
  { id: "2", name: "Mộ Dung Tuyết", realm: "Đại Thừa", sect: "Bắc Hải Tiên Cung", power: 92450, dharma: "Băng Phượng Pháp Tướng" },
  { id: "3", name: "Diệp Cô Thành", realm: "Đại Thừa", sect: "Vô Tông Vô Phái", power: 88200, dharma: "Kiếm Tổ Pháp Tướng" },
  { id: "4", name: "Tô Mặc Hàn", realm: "Hợp Thể", sect: "Thái Cực Môn", power: 76340, dharma: "Lưỡng Nghi Pháp Tướng" },
  { id: "5", name: "Hàn Lập", realm: "Hợp Thể", sect: "Hoàng Phong Cốc", power: 71820, dharma: "Bích Lân Pháp Tướng" },
  { id: "6", name: "Bạch Tiểu Thuần", realm: "Luyện Hư", sect: "Tùng Hạc Lâu", power: 64500, dharma: "Bạch Hạc Pháp Tướng" },
  { id: "7", name: "Tần Vũ", realm: "Luyện Hư", sect: "Phần Thiên Tông", power: 58900, dharma: "Hoả Lân Pháp Tướng" },
  { id: "8", name: "Lâm Phong", realm: "Hoá Thần", sect: "Tiêu Dao Phái", power: 49200, dharma: "Phong Long Pháp Tướng" },
];

export const rankLabels: Record<RealmRank, string> = {
  common: "Phàm Phẩm",
  uncommon: "Hoàng Phẩm",
  rare: "Huyền Phẩm",
  epic: "Địa Phẩm",
  legend: "Thiên Phẩm",
  myth: "Tiên Phẩm",
};
