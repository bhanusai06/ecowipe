const users = [];

class UserMock {
    constructor(data) {
        this._id = data._id || Math.random().toString(36).substr(2, 9);
        Object.assign(this, data);

        // Defaults matching Mongoose schema
        if (!this.created_at) this.created_at = new Date();
        if (!this.eco_badges) this.eco_badges = [];
        if (this.total_eco_points === undefined) this.total_eco_points = 0;
        if (this.total_devices_wiped === undefined) this.total_devices_wiped = 0;
        if (this.total_data_wiped_gb === undefined) this.total_data_wiped_gb = 0;
        if (!this.role) this.role = 'user';
        if (this.isVerified === undefined) this.isVerified = false;
    }

    async save() {
        const existingIndex = users.findIndex(u => u._id === this._id);
        if (existingIndex >= 0) {
            users[existingIndex] = this;
        } else {
            users.push(this);
        }
        return this;
    }

    // Instance method for Mongoose compatibility if needed (e.g. user.select)
    // Mocking select via simple deleting of keys on return object if needed, 
    // but for now relying on route logic not to break.
    // select() is a query method, typically chained. user.select() is not instance.

    static async findOne(query) {
        if (query.email) {
            const user = users.find(u => u.email === query.email);
            return user ? new UserMock(user) : null;
        }
        return null;
    }

    static async findById(id) {
        const user = users.find(u => u._id === id);
        if (!user) return null;

        const userObj = new UserMock(user);
        // Mock select chaining
        userObj.select = function (fields) {
            if (fields === '-password -otp -otpExpires') {
                const { password, otp, otpExpires, ...rest } = this;
                return rest;
            }
            return this;
        };
        return userObj;
    }

    static async find() {
        return users.map(u => new UserMock(u));
    }
}

module.exports = UserMock;
