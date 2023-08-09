export const sortBy = {
    createdAt: 'createdAt',
    view: 'view',
    sold: 'sold',
    price: 'price'
} as const

export const order = {
    asc: 'asc',
    desc: 'desc',
} as const

// sử dụng từ khóa as const, đối tượng sortBy được gắn kiểu cố định (literal type) dựa trên giá trị của nó. Điều này đảm bảo rằng các giá trị trong sortBy sẽ không thể được gán lại hoặc thay đổi. Hạn chế gõ sai 