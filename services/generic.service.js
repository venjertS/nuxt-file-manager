import axios from './request.service';

export default class GenericService {
    constructor({ url, name }) {
        this.url = url;
        this.name = name;
    }
    async search(params) {
        try {
            let qs = Object.keys(params)
                .map(
                    key =>
                        `${encodeURIComponent(key)}=${encodeURIComponent(
                            params[key]
                        )}`
                )
                .join('&');

            qs = qs ? '?' + qs : '';
            console.log(qs);
            const { data } = await axios.get(`${this.url}/search${qs}`);
            return data;
        } catch (err) {
            throw {
                err,
                error: true,
                message: `${this.name} on fetch all something wrong`,
            };
        }
    }
    async fetchAll(params) {
        try {
            let qs = Object.keys(params)
                .map(
                    key =>
                        `${encodeURIComponent(key)}=${encodeURIComponent(
                            params[key]
                        )}`
                )
                .join('&');

            qs = qs ? '?' + qs : '';
            console.log(qs);
            const { data } = await axios.get(`${this.url}${qs}`);
            return data;
        } catch (err) {
            throw {
                err,
                error: true,
                message: `${this.name} on fetch all something wrong`,
            };
        }
    }
    async fetchOne(id) {
        try {
            const { data } = await axios.get(`${this.url}/${id}`);
            return data;
        } catch (err) {
            throw {
                err,
                error: true,
                message: `${this.name} with fetchOne request something wrong`,
            };
        }
    }
    async create(payload) {
        try {
            const { data } = await axios.post(`${this.url}`, payload);
            return data;
        } catch (err) {
            console.log(err);
            throw {
                err,
                error: true,
                message: `${this.name} with create request something wrong`,
            };
        }
    }
    async update(id, payload) {
        try {
            const { data } = await axios.put(`${this.url}/${id}`, payload);
            return data;
        } catch (err) {
            throw {
                err,
                error: true,
                message: `${this.name} with update request something wrong`,
            };
        }
    }
    async delete(id) {
        try {
            await axios.delete(`${this.url}/${id}`);
        } catch (err) {
            throw {
                err,
                error: true,
                message: `${this.name} with delete request something wrong`,
            };
        }
    }
}
