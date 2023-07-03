export const BASE_API = 'https://staging.books.monsters.vn/apis'
export const WEB_SHOP_URL = 'https://staging.shops.books.monsters.vn/'
export const BASE_FILE = 'https://staging.books.monsters.vn/files'

// export const BASE_API = 'https://books.monsters.vn/apis'
// export const WEB_SHOP_URL = 'https://shops.books.monsters.vn/'
// export const BASE_FILE = 'https://books.monsters.vn/files'


export const BASE_ACCOUNT = 'https://accounts.monsters.vn'
export const FANPAGE_URL = 'https://www.facebook.com/shop.mbooks'
export const MESSENGER_URL = 'https://m.me/107889521984861'

export const PrevChooseAddress = {
  CHECK_OUT: 1,
  SHIP_DINH_GIA: 2
}

export const BUY_STATUS = [
  '*',
  'ORDERED',
  'APPROVED',
  'SHIPPING',
  'USER_RECEIVED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED'
]

export const BUY_STATUS_VN = {
  '*': 'TẤT CẢ',
  'ORDERED': 'CHỜ XÁC NHẬN',
  'APPROVED': 'ĐÃ XÁC NHẬN',
  'SHIPPING': 'ĐANG GIAO',
  'USER_RECEIVED': 'ĐÃ NHẬN',
  'COMPLETED': 'HOÀN THÀNH',
  'REJECTED': 'MAXMIN TỪ CHỐI',
  'CANCELLED': 'ĐÃ HỦY'
}

export const BUY_COLOR = {
  'ORDERED': '#007bff',
  'APPROVED': '#17a2b8',
  'SHIPPING': '#ffc107',
  'COMPLETED': '#28e745',
  'REJECTED': '#dc3545',
  'CANCELLED': '#666'
}

export const DEPOSIT_STATUS = [
  '*',
  'MONSTERS_PRICING',
  'USER_APPROVAL',
  'USER_SHIP_SELECT',
  'SHIPPING',
  'SHOP_RECEIVED',
  'USER_RE_APPROVAL',
  'COMPLETED',
  'REJECTED',
  'CANCELLED'
]

export const DEPOSIT_STATUS_VN = {
  '*': 'TẤT CẢ',
  'MONSTERS_PRICING': 'CHỜ ĐỊNH GIÁ',
  'USER_APPROVAL': 'BẠN PHÊ DUYỆT',
  'USER_SHIP_SELECT': 'CHỌN ĐỊA CHỈ',
  'SHIPPING': 'ĐANG GIAO',
  'SHOP_RECEIVED': 'ĐÃ NHẬN',
  'USER_RE_APPROVAL': 'PHÊ DUYỆT LẠI',
  'COMPLETED': 'HOÀN THÀNH',
  'REJECTED': 'MAXMIN TỪ CHỐI',
  'CANCELLED': 'ĐÃ HỦY'
}

export const DEPOSIT_COLOR = {
  'MONSTERS_PRICING': '#007bff',
  'USER_APPROVAL': '#17a2b8',
  'USER_SHIP_SELECT': '#17a2b8',
  'SHIPPING': '#ffc107',
  'USER_RE_APPROVAL': '#ffc107',
  'COMPLETED': '#28e745',
  'REJECTED': '#dc3545',
  'CANCELLED': '#ccc'
}

export const OTYPE = [
  '*',
  'NEW',
  'LIKE_NEW',
  'VERY_GOOD',
  'GOOD',
  'ACCEPTABLE'
]

export const OTYPE_VN = {
  '*': 'Tất cả',
  '': 'Tất cả',
  'NEW': 'Mới',
  'LIKE_NEW': 'Cũ như mới',
  'VERY_GOOD': 'Cũ nhưng rất tốt',
  'GOOD': 'Cũ nhưng tốt',
  'ACCEPTABLE': 'Cũ dùng được',
}

export const MBOOKS_ADDRESSES = [
  {
    name: "Chi nhánh 1",
    street: "505 Minh Khai (TTTM V+)",
    ward: "Vĩnh Tuy",
    district: "Hai Bà Trưng",
    province: "Hà Nội",
    mobile: "0904464538",
  },
  // {
  //   name: "Chi nhánh 2",
  //   street: "Số 2, đường Cổ Linh",
  //   ward: "Thạch Bàn",
  //   district: "Long Biên",
  //   province: "Hà Nội",
  //   mobile: "012345678",
  // }
]

export const GIFT_CARD_CHOICES = [
  {
    type: 'SILVER',
    name: 'Thẻ bạc',
    price: 50000
  },
  {
    type: 'GOLD',
    name: 'Thẻ vàng',
    price: 100000
  },
  {
    type: 'PLATINUM',
    name: 'Thẻ bạch kim',
    price: 200000
  },
  {
    type: 'RUBY',
    name: 'Thẻ ruby',
    price: 300000
  },
  {
    type: 'DIAMOND',
    name: 'Thẻ kim cương',
    price: 500000
  },
]

export const GIFT_CARD_TYPES = {
  'SILVER': {
    type: 'SILVER',
    name: 'Thẻ bạc',
    price: 50000
  },
  'GOLD': {
    type: 'GOLD',
    name: 'Thẻ vàng',
    price: 100000
  },
  'PLATINUM': {
    type: 'PLATINUM',
    name: 'Thẻ bạch kim',
    price: 200000
  },
  'RUBY': {
    type: 'RUBY',
    name: 'Thẻ ruby',
    price: 300000
  },
  'DIAMOND': {
    type: 'DIAMOND',
    name: 'Thẻ kim cương',
    price: 500000
  }
}

export const WITHDRAW_CHOICES = [
  {
    price: 50000
  },
  {
    price: 100000
  },
  {
    price: 200000
  },
  {
    price: 300000
  },
  {
    price: 500000
  },
]

export const RETURN_DEPOSIT_CART_STATUS = [
  '*',
  'REQUESTED',
  'SHIPPING',
  'USER_RECEIVED',
  'COMPLETED'
]

export const RETURN_DEPOSIT_CART_STATUS_VN = {
  '*': 'TẤT CẢ',
  'REQUESTED': 'ĐÃ YÊU CẦU',
  'SHIPPING': 'ĐANG VẬN CHUYỂN',
  'USER_RECEIVED': 'ĐÃ NHẬN',
  'COMPLETED': 'HOÀN THÀNH',
}

export const RETURN_ORDERED_CART_STATUS = [
  '*',
  'REQUESTED',
  'SHIPPING',
  'SHOP_RECEIVED',
  'COMPLETED'
]

export const RETURN_ORDERED_CART_STATUS_VN = {
  '*': 'TẤT CẢ',
  'REQUESTED': 'ĐÃ YÊU CẦU',
  'SHIPPING': 'ĐANG VẬN CHUYỂN',
  'SHOP_RECEIVED': 'SHOP ĐÃ NHẬN',
  'COMPLETED': 'HOÀN THÀNH',
}

export const RETURN_COLOR = {
  'REQUESTED': '#007bff',
  'SHIPPING': '#ffc107',
  'USER_RECEIVED': '#ffc107',
  'SHOP_RECEIVED': '#ffc107',
  'COMPLETED': '#28e745',
}

export const RETURN_ITEM_STATUS = [
  'KEEP',
  'RETURN'
]

export const RETURN_ITEM_STATUS_VN = {
  'KEEP': 'Giữ hàng',
  'RETURN': 'Hoàn trả'
}

export const RETURN_ITEM_COLOR = {
  'KEEP': '#28e745',
  'RETURN': '#dc3545'
}

export const DOC_URL = {
  'LEARN-MORE': {
    'url': 'https://docs.google.com/document/d/1tRAmVFtHDQ2XOAGk3pEh3u3ULwITqUJOjeM6bvzjwQ8/edit?usp=sharing',
    'title': 'Giới thiệu về bán đồ cũ cho Maxmin',
    'footer': null
  },
  'HANDLE-COMPLAINT': {
    'url': 'https://docs.google.com/document/d/1ZXvVimhoUwtekZajj1yM_SBE-QKt81TmoA2vGxm7R9M/edit?usp=sharing',
    'title': 'Xử lý khiếu nại',
    'footer': null
  },
  'SHOP-LEARN-MORE': {
    'url': 'https://docs.google.com/document/d/1s0REdowGttkGiUtupBHbMC9oxxycm1PuRnyzn02DtiU/edit?usp=sharing',
    'title': 'Giới thiệu về shop đối tác trao đổi mua, bán đồ cũ cùng Maxmin',
    'footer': 'shop-learn-more'
  },

}

