import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const messageAPI = createApi({
    reducerPath: 'messageAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/'}),
    tagTypes: ['Message'],
    endpoints: (builder) => ({
        // GET ALL
        getAllMessages: builder.query({
            query: () => 'messages',
            providesTags: (result) =>
                result
                    ? [...result.map(({id}) => ({type: 'Message', id})), {type: 'Message', id: 'LIST'}]
                    : [{type: 'Message', id: 'LIST'}],
        }),

        // GET BY ID
        getMessageById: builder.query({
            query: (id) => `messages/${id}`,
            providesTags: (result, error, id) => [{type: 'Message', id}],
        }),

        // POST
        createMessage: builder.mutation({
            query: (data) => ({
                url: 'messages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Message', id: 'LIST'}],
        }),

        // PUT
        updateMessage: builder.mutation({
            query: ({id, content}) => ({
                url: `messages/${id}`,
                method: 'PUT',
                body: {content},
            }),
            invalidatesTags: (result, error, {id}) => [{type: 'Message', id}],
        }),

        // DELETE
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `messages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{type: 'Message', id}],
        }),
    }),
});

export const {
    useGetAllMessagesQuery,
    useGetMessageByIdQuery,
    useCreateMessageMutation,
    useUpdateMessageMutation,
    useDeleteMessageMutation,
} = messageAPI;