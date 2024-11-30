import { MockContext, Context, createMockContext } from '../context'

let mockCtx: MockContext
let ctx: Context

let dtNow = new Date();

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
})

test('should create new user ', async () => {
    const user = {
        id: '1',
        isActive: true,
        email: 'hello@prisma.io',
        password: '12345',
        firstName: '',
        lastName: '',
        middleName: '',
        expiredPwd: dtNow,
        subsId: '1',
        createdAt: dtNow,
        updatedAt: dtNow,
    }

    mockCtx.prisma.user.create.mockResolvedValue(user);

    await expect(await ctx.prisma.user.create({
        data: user
    })).resolves.toEqual({
        id: '1',
        isActive: true,
        email: 'hello@prisma.io',
        password: '12345',
        firstName: '',
        lastName: '',
        middleName: '',
        expiredPwd: dtNow,
        subsId: '1',
        createdAt: dtNow,
        updatedAt: dtNow,
    })
})