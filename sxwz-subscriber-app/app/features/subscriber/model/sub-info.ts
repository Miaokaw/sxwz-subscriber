export interface Sub {
    roomId: number,
    uid: number,
    isTop: boolean,
    isLive: boolean,
}

export interface RoomInfo {
    name: string,
    roomId: number,
    uid: number,
    title: string,
    liveStartTime: number,
    cover: string,
    keyframe: string,
    popularity: number,
    users: number,
    watched: number,
    fansclub: number,
    likes: number,
    attention: number,
    captains: number,
}

// https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=
export interface RoomInfoRes {
    code: number,
    message: string,
    data: {
        room_info: {
            uid: number,
            room_id: number,
            title: string,
            cover: string,
            live_status: number,
            live_start_time: number,
            keyframe: string,
        },
        anchor_info: {
            base_info: {
                uname: string,
                face: string,
            },
            relation_info: {
                attention: number,
            }
            medal_info:
            {
                medal_name: string,
                fansclub: number,
            }
        },
        // super_chat_info: {
        //     status: number,
        //     message_list: {
        //         price: number,
        //         background_color: string,
        //         background_price_color: string,
        //         background_bottom_color: string,
        //         start_time: number,
        //         end_time: number,
        //         message: string,
        //         user_info: {
        //             face: string,
        //             uname: string,
        //             user_level: number,
        //             guard_level: number,
        //         }
        //     }[]
        // },
        watched_show: {
            num: number,
        },
        like_info_v3: {
            total_likes: number,
        }
        guard_info: {
            count: number,
        },
        room_rank_info: {
            user_rank_entry: {
                user_contribution_rank_entry: {
                    count: number,
                }
            }
        },
        popularity: {
            popularity: number,
        }
    }
}