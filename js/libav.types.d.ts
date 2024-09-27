/*
 * Copyright (C) 2021-2024 Yahweasel and contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * Things in libav.js with Worker transfer characteristics.
 */
export interface LibAVTransferable {
    /**
     * The elements to pass as transfers when passing this object to/from
     * workers.
     */
    libavjsTransfer?: Transferable[];
}

/**
 * Frames, as taken/given by libav.js.
 */
export interface Frame extends LibAVTransferable {
    /**
     * The actual frame data. For non-planar audio data, this is a typed array.
     * For planar audio data, this is an array of typed arrays, one per plane.
     * For video data, this is a single Uint8Array, and its layout is described
     * by the layout field.
     */
    data: any;

    /**
     * Sample format or pixel format.
     */
    format: number;

    /**
     * Video only. Layout of each plane within the data array. `offset` is the
     * base offset of the plane, and `stride` is what libav calls `linesize`.
     * This layout format is from WebCodecs.
     */
    layout?: {offset: number, stride: number}[];

    /**
     * Presentation timestamp for this frame. Units depends on surrounding
     * context. Will always be set by libav.js, but libav.js will accept frames
     * from outside that do not have this set.
     */
    pts?: number, ptshi?: number;

    /**
     * Base for timestamps of this frame.
     */
    time_base_num?: number, time_base_den?: number;

    /**
     * Audio only. Channel layout. It is possible for only one of this and
     * channels to be set.
     */
    channel_layout?: number;

    /**
     * Audio only. Number of channels. It is possible for only one of this and
     * channel_layout to be set.
     */
    channels?: number;

    /**
     * Audio only. Number of samples in the frame.
     */
    nb_samples?: number;

    /**
     * Audio only. Sample rate.
     */
    sample_rate?: number;

    /**
     * Video only. Width of frame.
     */
    width?: number;

    /**
     * Video only. Height of frame.
     */
    height?: number;

    /**
     * Video only. Cropping rectangle of the frame.
     */
    crop?: {top: number, bottom: number, left: number, right: number};

    /**
     * Video only. Sample aspect ratio (pixel aspect ratio), as a numerator and
     * denominator. 0 is interpreted as 1 (square pixels).
     */
    sample_aspect_ratio?: [number, number];

    /**
     * Is this a keyframe? (1=yes, 0=maybe)
     */
    key_frame?: number;

    /**
     * Picture type (libav-specific value)
     */
    pict_type?: number;
}

/**
 * Packets, as taken/given by libav.js.
 */
export interface Packet extends LibAVTransferable {
    /**
     * The actual data represented by this packet.
     */
    data: Uint8Array;

    /**
     * Presentation timestamp.
     */
    pts?: number, ptshi?: number;

    /**
     * Decoding timestamp.
     */
    dts?: number, dtshi?: number;

    /**
     * Base for timestamps of this packet.
     */
    time_base_num?: number, time_base_den?: number;

    /**
     * Index of this stream within a surrounding muxer/demuxer.
     */
    stream_index?: number;

    /**
     * Packet flags, as defined by ffmpeg.
     */
    flags?: number;

    /**
     * Duration of this packet. Rarely used.
     */
    duration?: number, durationhi?: number;

    /**
     * Side data. Codec-specific.
     */
    side_data?: any;
}

/**
 * Stream information, as returned by ff_init_demuxer_file.
 */
export interface Stream {
    /**
     * Pointer to the underlying AVStream.
     */
    ptr: number;

    /**
     * Index of this stream.
     */
    index: number;

    /**
     * Codec parameters.
     */
    codecpar: number;

    /**
     * Type of codec (audio or video, typically)
     */
    codec_type: number;

    /**
     * Codec identifier.
     */
    codec_id: number;

    /**
     * Base for timestamps of packets in this stream.
     */
    time_base_num: number, time_base_den: number;

    /**
     * Duration of this stream in time_base units.
     */
    duration_time_base: number;

    /**
     * Duration of this stream in seconds.
     */
    duration: number;
}

/**
 * Settings used to set up a filter.
 */
export interface FilterIOSettings {
    /**
     * Type of filterchain, as an AVMEDIA_TYPE_*. If unset, defaults to
     * AVMEDIA_TYPE_AUDIO.
     */
    type?: number;

    /**
     * The timebase for this filterchain. If unset, [1, frame_rate] or [1,
     * sample_rate] will be used.
     */
    time_base?: [number, number];

    /**
     * Video only. Framerate of the input.
     */
    frame_rate?: number;

    /**
     * Audio only. Sample rate of the input.
     */
    sample_rate?: number;

    /**
     * Video only. Pixel format of the input.
     */
    pix_fmt?: number;

    /**
     * Audio only. Sample format of the input.
     */
    sample_fmt?: number;

    /**
     * Video only. Width of the input.
     */
    width?: number;

    /**
     * Video only. Height of the input.
     */
    height?: number;

    /**
     * Audio only. Channel layout of the input. Note that there is no
     * "channels"; you must describe a layout.
     */
    channel_layout?: number;

    /**
     * Audio only, output only, optional. Size of an audio frame.
     */
    frame_size?: number;
}

/**
 * Supported properties of an AVCodecContext, used by ff_init_encoder.
 */
export interface AVCodecContextProps {
    bit_rate?: number;
    bit_ratehi?: number;
    channel_layout?: number;
    channel_layouthi?: number;
    channels?: number;
    frame_size?: number;
    framerate_num?: number;
    framerate_den?: number;
    gop_size?: number;
    height?: number;
    keyint_min?: number;
    level?: number;
    pix_fmt?: number;
    profile?: number;
    rc_max_rate?: number;
    rc_max_ratehi?: number;
    rc_min_rate?: number;
    rc_min_ratehi?: number;
    sample_aspect_ratio_num?: number;
    sample_aspect_ratio_den?: number;
    sample_fmt?: number;
    sample_rate?: number;
    qmax?: number;
    qmin?: number;
    width?: number;
}

/**
 * Static properties that are accessible both on the LibAV wrapper and on each
 * libav instance.
 */
export interface LibAVStatic {
    /**
     * Convert a pair of 32-bit integers representing a single 64-bit integer
     * into a 64-bit float. 64-bit floats are only sufficient for 53 bits of
     * precision, so for very large values, this is lossy.
     * @param lo  Low bits of the pair
     * @param hi  High bits of the pair
     */
    i64tof64(lo: number, hi: number): number;

    /**
     * Convert a 64-bit floating-point number into a pair of 32-bit integers
     * representing a single 64-bit integer. The 64-bit float must actually
     * contain an integer value for this result to be accurate.
     * @param val  Floating-point value to convert
     * @returns [low bits, high bits]
     */
    f64toi64(val: number): [number, number];

    /**
     * Convert a pair of 32-bit integers representing a single 64-bit integer
     * into a BigInt. Requires BigInt support, of course.
     * @param lo  Low bits of the pair
     * @param hi  High bits of the pair
     */
    i64ToBigInt(lo: number, hi: number): BigInteger;

    /**
     * Convert a (64-bit) BigInt into a pair of 32-bit integers. Requires BigInt
     * support, of course.
     * @param val  BigInt value to convert
     * @returns [low bits, high bits]
     */
    bigIntToi64(val: BigInteger): [number, number];

    // Enumerations:
    AV_OPT_SEARCH_CHILDREN: number;
    AVMEDIA_TYPE_UNKNOWN: number;
    AVMEDIA_TYPE_VIDEO: number;
    AVMEDIA_TYPE_AUDIO: number;
    AVMEDIA_TYPE_DATA: number;
    AVMEDIA_TYPE_SUBTITLE: number;
    AVMEDIA_TYPE_ATTACHMENT: number;
    AV_SAMPLE_FMT_NONE: number;
    AV_SAMPLE_FMT_U8: number;
    AV_SAMPLE_FMT_S16: number;
    AV_SAMPLE_FMT_S32: number;
    AV_SAMPLE_FMT_FLT: number;
    AV_SAMPLE_FMT_DBL: number;
    AV_SAMPLE_FMT_U8P: number;
    AV_SAMPLE_FMT_S16P: number;
    AV_SAMPLE_FMT_S32P: number;
    AV_SAMPLE_FMT_FLTP: number;
    AV_SAMPLE_FMT_DBLP: number;
    AV_SAMPLE_FMT_S64: number;
    AV_SAMPLE_FMT_S64P: number;
    AV_SAMPLE_FMT_NB: number;
    AV_PIX_FMT_NONE: number;
    AV_PIX_FMT_YUV420P: number;
    AV_PIX_FMT_YUYV422: number;
    AV_PIX_FMT_RGB24: number;
    AV_PIX_FMT_BGR24: number;
    AV_PIX_FMT_YUV422P: number;
    AV_PIX_FMT_YUV444P: number;
    AV_PIX_FMT_YUV410P: number;
    AV_PIX_FMT_YUV411P: number;
    AV_PIX_FMT_GRAY8: number;
    AV_PIX_FMT_MONOWHITE: number;
    AV_PIX_FMT_MONOBLACK: number;
    AV_PIX_FMT_PAL8: number;
    AV_PIX_FMT_YUVJ420P: number;
    AV_PIX_FMT_YUVJ422P: number;
    AV_PIX_FMT_YUVJ444P: number;
    AV_PIX_FMT_UYVY422: number;
    AV_PIX_FMT_UYYVYY411: number;
    AV_PIX_FMT_BGR8: number;
    AV_PIX_FMT_BGR4: number;
    AV_PIX_FMT_BGR4_BYTE: number;
    AV_PIX_FMT_RGB8: number;
    AV_PIX_FMT_RGB4: number;
    AV_PIX_FMT_RGB4_BYTE: number;
    AV_PIX_FMT_NV12: number;
    AV_PIX_FMT_NV21: number;
    AV_PIX_FMT_ARGB: number;
    AV_PIX_FMT_RGBA: number;
    AV_PIX_FMT_ABGR: number;
    AV_PIX_FMT_BGRA: number;
    AV_PIX_FMT_GRAY16BE: number;
    AV_PIX_FMT_GRAY16LE: number;
    AV_PIX_FMT_YUV440P: number;
    AV_PIX_FMT_YUVJ440P: number;
    AV_PIX_FMT_YUVA420P: number;
    AV_PIX_FMT_RGB48BE: number;
    AV_PIX_FMT_RGB48LE: number;
    AV_PIX_FMT_RGB565BE: number;
    AV_PIX_FMT_RGB565LE: number;
    AV_PIX_FMT_RGB555BE: number;
    AV_PIX_FMT_RGB555LE: number;
    AV_PIX_FMT_BGR565BE: number;
    AV_PIX_FMT_BGR565LE: number;
    AV_PIX_FMT_BGR555BE: number;
    AV_PIX_FMT_BGR555LE: number;
    AVIO_FLAG_READ: number;
    AVIO_FLAG_WRITE: number;
    AVIO_FLAG_READ_WRITE: number;
    AVIO_FLAG_NONBLOCK: number;
    AVIO_FLAG_DIRECT: number;
    AVSEEK_FLAG_BACKWARD: number;
    AVSEEK_FLAG_BYTE: number;
    AVSEEK_FLAG_ANY: number;
    AVSEEK_FLAG_FRAME: number;
    AVDISCARD_NONE: number;
    AVDISCARD_DEFAULT: number;
    AVDISCARD_NONREF: number;
    AVDISCARD_BIDIR: number;
    AVDISCARD_NONINTRA: number;
    AVDISCARD_NONKEY: number;
    AVDISCARD_ALL: number;
    AV_LOG_QUIET: number;
    AV_LOG_PANIC: number;
    AV_LOG_FATAL: number;
    AV_LOG_ERROR: number;
    AV_LOG_WARNING: number;
    AV_LOG_INFO: number;
    AV_LOG_VERBOSE: number;
    AV_LOG_DEBUG: number;
    AV_LOG_TRACE: number;
    AV_PKT_FLAG_KEY: number;
    AV_PKT_FLAG_CORRUPT: number;
    AV_PKT_FLAG_DISCARD: number;
    AV_PKT_FLAG_TRUSTED: number;
    AV_PKT_FLAG_DISPOSABLE: number;
    E2BIG: number;
    EPERM: number;
    EADDRINUSE: number;
    EADDRNOTAVAIL: number;
    EAFNOSUPPORT: number;
    EAGAIN: number;
    EALREADY: number;
    EBADF: number;
    EBADMSG: number;
    EBUSY: number;
    ECANCELED: number;
    ECHILD: number;
    ECONNABORTED: number;
    ECONNREFUSED: number;
    ECONNRESET: number;
    EDEADLOCK: number;
    EDESTADDRREQ: number;
    EDOM: number;
    EDQUOT: number;
    EEXIST: number;
    EFAULT: number;
    EFBIG: number;
    EHOSTUNREACH: number;
    EIDRM: number;
    EILSEQ: number;
    EINPROGRESS: number;
    EINTR: number;
    EINVAL: number;
    EIO: number;
    EISCONN: number;
    EISDIR: number;
    ELOOP: number;
    EMFILE: number;
    EMLINK: number;
    EMSGSIZE: number;
    EMULTIHOP: number;
    ENAMETOOLONG: number;
    ENETDOWN: number;
    ENETRESET: number;
    ENETUNREACH: number;
    ENFILE: number;
    ENOBUFS: number;
    ENODEV: number;
    ENOENT: number;
    AVERROR_EOF: number;
}

/**
 * A LibAV instance, created by LibAV.LibAV (*not* the LibAV wrapper itself)
 */
export interface LibAV extends LibAVStatic {
    /**
     * The operating mode of this libav.js instance. Each operating mode has
     * different constraints.
     */
    libavjsMode: "direct" | "worker" | "threads";

    /**
     * If the operating mode is "worker", the worker itself.
     */
    worker?: Worker;

/**
 * Return number of bytes per sample.
 *
 * @param sample_fmt the sample format
 * @return number of bytes per sample or zero if unknown for the given
 * sample format
 */
av_get_bytes_per_sample(sample_fmt: number): Promise<number>;
/**
 * Compare two timestamps each in its own time base.
 *
 * @return One of the following values:
 *         - -1 if `ts_a` is before `ts_b`
 *         - 1 if `ts_a` is after `ts_b`
 *         - 0 if they represent the same position
 *
 * @warning
 * The result of the function is undefined if one of the timestamps is outside
 * the `int64_t` range when represented in the other's timebase.
 */
av_compare_ts_js(ts_a: number,tb_a: number,ts_b: number,tb_b: number,a4: number,a5: number,a6: number,a7: number): Promise<number>;
/**
 * @defgroup opt_set_funcs Option setting functions
 * @{
 * Those functions set the field of obj with the given name to value.
 *
 * @param[in] obj A struct whose first element is a pointer to an AVClass.
 * @param[in] name the name of the field to set
 * @param[in] val The value to set. In case of av_opt_set() if the field is not
 * of a string type, then the given string is parsed.
 * SI postfixes and some named scalars are supported.
 * If the field is of a numeric type, it has to be a numeric or named
 * scalar. Behavior with more than one scalar and +- infix operators
 * is undefined.
 * If the field is of a flags type, it has to be a sequence of numeric
 * scalars or named flags separated by '+' or '-'. Prefixing a flag
 * with '+' causes it to be set without affecting the other flags;
 * similarly, '-' unsets a flag.
 * If the field is of a dictionary type, it has to be a ':' separated list of
 * key=value parameters. Values containing ':' special characters must be
 * escaped.
 * @param search_flags flags passed to av_opt_find2. I.e. if AV_OPT_SEARCH_CHILDREN
 * is passed here, then the option may be set on a child of obj.
 *
 * @return 0 if the value has been set, or an AVERROR code in case of
 * error:
 * AVERROR_OPTION_NOT_FOUND if no matching option exists
 * AVERROR(ERANGE) if the value is out of range
 * AVERROR(EINVAL) if the value is not valid
 */
av_opt_set(obj: number,name: string,val: string,search_flags: number): Promise<number>;
av_opt_set_int_list_js(a0: number,a1: string,a2: number,a3: number,a4: number,a5: number): Promise<number>;
/**
 * Allocate an AVFrame and set its fields to default values.  The resulting
 * struct must be freed using av_frame_free().
 *
 * @return An AVFrame filled with default values or NULL on failure.
 *
 * @note this only allocates the AVFrame itself, not the data buffers. Those
 * must be allocated through other means, e.g. with av_frame_get_buffer() or
 * manually.
 */
av_frame_alloc(): Promise<number>;
/**
 * Create a new frame that references the same data as src.
 *
 * This is a shortcut for av_frame_alloc()+av_frame_ref().
 *
 * @return newly created AVFrame on success, NULL on error.
 */
av_frame_clone(src: number,a1: number): Promise<number>;
/**
 * Free the frame and any dynamically allocated objects in it,
 * e.g. extended_data. If the frame is reference counted, it will be
 * unreferenced first.
 *
 * @param frame frame to be freed. The pointer will be set to NULL.
 */
av_frame_free(frame: number): Promise<void>;
/**
 * Allocate new buffer(s) for audio or video data.
 *
 * The following fields must be set on frame before calling this function:
 * - format (pixel format for video, sample format for audio)
 * - width and height for video
 * - nb_samples and ch_layout for audio
 *
 * This function will fill AVFrame.data and AVFrame.buf arrays and, if
 * necessary, allocate and fill AVFrame.extended_data and AVFrame.extended_buf.
 * For planar formats, one buffer will be allocated for each plane.
 *
 * @warning: if frame already has been allocated, calling this function will
 *           leak memory. In addition, undefined behavior can occur in certain
 *           cases.
 *
 * @param frame frame in which to store the new buffers.
 * @param align Required buffer size alignment. If equal to 0, alignment will be
 *              chosen automatically for the current CPU. It is highly
 *              recommended to pass 0 here unless you know what you are doing.
 *
 * @return 0 on success, a negative AVERROR on error.
 */
av_frame_get_buffer(frame: number,align: number): Promise<number>;
/**
 * Ensure that the frame data is writable, avoiding data copy if possible.
 *
 * Do nothing if the frame is writable, allocate new buffers and copy the data
 * if it is not. Non-refcounted frames behave as non-writable, i.e. a copy
 * is always made.
 *
 * @return 0 on success, a negative AVERROR on error.
 *
 * @see av_frame_is_writable(), av_buffer_is_writable(),
 * av_buffer_make_writable()
 */
av_frame_make_writable(frame: number): Promise<number>;
/**
 * Set up a new reference to the data described by the source frame.
 *
 * Copy frame properties from src to dst and create a new reference for each
 * AVBufferRef from src.
 *
 * If src is not reference counted, new buffers are allocated and the data is
 * copied.
 *
 * @warning: dst MUST have been either unreferenced with av_frame_unref(dst),
 *           or newly allocated with av_frame_alloc() before calling this
 *           function, or undefined behavior will occur.
 *
 * @return 0 on success, a negative AVERROR on error
 */
av_frame_ref(dst: number,src: number): Promise<number>;
/**
 * Unreference all the buffers referenced by frame and reset the frame fields.
 */
av_frame_unref(frame: number): Promise<void>;
ff_frame_rescale_ts_js(a0: number,a1: number,a2: number,a3: number,a4: number): Promise<void>;
/**
 * Get the current log level
 *
 * @see lavu_log_constants
 *
 * @return Current log level
 */
av_log_get_level(): Promise<number>;
/**
 * Set the log level
 *
 * @see lavu_log_constants
 *
 * @param level Logging level
 */
av_log_set_level(level: number): Promise<void>;
/**
 * Allocate an AVPacket and set its fields to default values.  The resulting
 * struct must be freed using av_packet_free().
 *
 * @return An AVPacket filled with default values or NULL on failure.
 *
 * @note this only allocates the AVPacket itself, not the data buffers. Those
 * must be allocated through other means such as av_new_packet.
 *
 * @see av_new_packet
 */
av_packet_alloc(): Promise<number>;
/**
 * Create a new packet that references the same data as src.
 *
 * This is a shortcut for av_packet_alloc()+av_packet_ref().
 *
 * @return newly created AVPacket on success, NULL on error.
 *
 * @see av_packet_alloc
 * @see av_packet_ref
 */
av_packet_clone(src: number): Promise<number>;
/**
 * Free the packet, if the packet is reference counted, it will be
 * unreferenced first.
 *
 * @param pkt packet to be freed. The pointer will be set to NULL.
 * @note passing NULL is a no-op.
 */
av_packet_free(pkt: number): Promise<void>;
/**
 * Allocate new information of a packet.
 *
 * @param pkt packet
 * @param type side information type
 * @param size side information size
 * @return pointer to fresh allocated data or NULL otherwise
 */
av_packet_new_side_data(pkt: number,type: number,size: number): Promise<number>;
/**
 * Setup a new reference to the data described by a given packet
 *
 * If src is reference-counted, setup dst as a new reference to the
 * buffer in src. Otherwise allocate a new buffer in dst and copy the
 * data from src into it.
 *
 * All the other fields are copied from src.
 *
 * @see av_packet_unref
 *
 * @param dst Destination packet. Will be completely overwritten.
 * @param src Source packet
 *
 * @return 0 on success, a negative AVERROR on error. On error, dst
 *         will be blank (as if returned by av_packet_alloc()).
 */
av_packet_ref(dst: number,src: number): Promise<number>;
/**
 * Convert valid timing fields (timestamps / durations) in a packet from one
 * timebase to another. Timestamps with unknown values (AV_NOPTS_VALUE) will be
 * ignored.
 *
 * @param pkt packet on which the conversion will be performed
 * @param tb_src source timebase, in which the timing fields in pkt are
 *               expressed
 * @param tb_dst destination timebase, to which the timing fields will be
 *               converted
 */
av_packet_rescale_ts_js(pkt: number,tb_src: number,tb_dst: number,a3: number,a4: number): Promise<void>;
/**
 * Wipe the packet.
 *
 * Unreference the buffer referenced by the packet and reset the
 * remaining packet fields to their default values.
 *
 * @param pkt The packet to be unreferenced.
 */
av_packet_unref(pkt: number): Promise<void>;
/**
 * Duplicate a string.
 *
 * @param s String to be duplicated
 * @return Pointer to a newly-allocated string containing a
 *         copy of `s` or `NULL` if the string cannot be allocated
 * @see av_strndup()
 */
av_strdup(s: string): Promise<number>;
/**
 * Get a frame with filtered data from sink and put it in frame.
 *
 * @param ctx pointer to a context of a buffersink or abuffersink AVFilter.
 * @param frame pointer to an allocated frame that will be filled with data.
 *              The data must be freed using av_frame_unref() / av_frame_free()
 *
 * @return
 *         - >= 0 if a frame was successfully returned.
 *         - AVERROR(EAGAIN) if no frames are available at this point; more
 *           input frames must be added to the filtergraph to get more output.
 *         - AVERROR_EOF if there will be no more output frames on this sink.
 *         - A different negative AVERROR code in other failure cases.
 */
av_buffersink_get_frame(ctx: number,frame: number): Promise<number>;
av_buffersink_get_time_base_num(a0: number): Promise<number>;
av_buffersink_get_time_base_den(a0: number): Promise<number>;
/**
 * Set the frame size for an audio buffer sink.
 *
 * All calls to av_buffersink_get_buffer_ref will return a buffer with
 * exactly the specified number of samples, or AVERROR(EAGAIN) if there is
 * not enough. The last buffer at EOF will be padded with 0.
 */
av_buffersink_set_frame_size(ctx: number,frame_size: number): Promise<void>;
/**
 * Add a frame to the buffer source.
 *
 * By default, if the frame is reference-counted, this function will take
 * ownership of the reference(s) and reset the frame. This can be controlled
 * using the flags.
 *
 * If this function returns an error, the input frame is not touched.
 *
 * @param buffer_src  pointer to a buffer source context
 * @param frame       a frame, or NULL to mark EOF
 * @param flags       a combination of AV_BUFFERSRC_FLAG_*
 * @return            >= 0 in case of success, a negative AVERROR code
 *                    in case of failure
 */
av_buffersrc_add_frame_flags(buffer_src: number,frame: number,flags: number): Promise<number>;
/**
 * Free a filter context. This will also remove the filter from its
 * filtergraph's list of filters.
 *
 * @param filter the filter to free
 */
avfilter_free(filter: number): Promise<void>;
/**
 * Get a filter definition matching the given name.
 *
 * @param name the filter name to find
 * @return     the filter definition, if any matching one is registered.
 *             NULL if none found.
 */
avfilter_get_by_name(name: string): Promise<number>;
/**
 * Allocate a filter graph.
 *
 * @return the allocated filter graph on success or NULL.
 */
avfilter_graph_alloc(): Promise<number>;
/**
 * Check validity and configure all the links and formats in the graph.
 *
 * @param graphctx the filter graph
 * @param log_ctx context used for logging
 * @return >= 0 in case of success, a negative AVERROR code otherwise
 */
avfilter_graph_config(graphctx: number,log_ctx: number): Promise<number>;
/**
 * Create and add a filter instance into an existing graph.
 * The filter instance is created from the filter filt and inited
 * with the parameter args. opaque is currently ignored.
 *
 * In case of success put in *filt_ctx the pointer to the created
 * filter instance, otherwise set *filt_ctx to NULL.
 *
 * @param name the instance name to give to the created filter instance
 * @param graph_ctx the filter graph
 * @return a negative AVERROR error code in case of failure, a non
 * negative value otherwise
 */
avfilter_graph_create_filter_js(filt_ctx: number,filt: string,name: string,args: number,opaque: number): Promise<number>;
/**
 * Free a graph, destroy its links, and set *graph to NULL.
 * If *graph is NULL, do nothing.
 */
avfilter_graph_free(graph: number): Promise<void>;
/**
 * Add a graph described by a string to a graph.
 *
 * @note The caller must provide the lists of inputs and outputs,
 * which therefore must be known before calling the function.
 *
 * @note The inputs parameter describes inputs of the already existing
 * part of the graph; i.e. from the point of view of the newly created
 * part, they are outputs. Similarly the outputs parameter describes
 * outputs of the already existing filters, which are provided as
 * inputs to the parsed filters.
 *
 * @param graph   the filter graph where to link the parsed graph context
 * @param filters string to be parsed
 * @param inputs  linked list to the inputs of the graph
 * @param outputs linked list to the outputs of the graph
 * @return zero on success, a negative AVERROR code on error
 */
avfilter_graph_parse(graph: number,filters: string,inputs: number,outputs: number,log_ctx: number): Promise<number>;
/**
 * Allocate a single AVFilterInOut entry.
 * Must be freed with avfilter_inout_free().
 * @return allocated AVFilterInOut on success, NULL on failure.
 */
avfilter_inout_alloc(): Promise<number>;
/**
 * Free the supplied list of AVFilterInOut and set *inout to NULL.
 * If *inout is NULL, do nothing.
 */
avfilter_inout_free(inout: number): Promise<void>;
/**
 * Link two filters together.
 *
 * @param src    the source filter
 * @param srcpad index of the output pad on the source filter
 * @param dst    the destination filter
 * @param dstpad index of the input pad on the destination filter
 * @return       zero on success
 */
avfilter_link(src: number,srcpad: number,dst: number,dstpad: number): Promise<number>;
/**
 * Allocate an AVCodecContext and set its fields to default values. The
 * resulting struct should be freed with avcodec_free_context().
 *
 * @param codec if non-NULL, allocate private data and initialize defaults
 *              for the given codec. It is illegal to then call avcodec_open2()
 *              with a different codec.
 *              If NULL, then the codec-specific defaults won't be initialized,
 *              which may result in suboptimal default settings (this is
 *              important mainly for encoders, e.g. libx264).
 *
 * @return An AVCodecContext filled with default values or NULL on failure.
 */
avcodec_alloc_context3(codec: number): Promise<number>;
/**
 * Close a given AVCodecContext and free all the data associated with it
 * (but not the AVCodecContext itself).
 *
 * Calling this function on an AVCodecContext that hasn't been opened will free
 * the codec-specific data allocated in avcodec_alloc_context3() with a non-NULL
 * codec. Subsequent calls will do nothing.
 *
 * @note Do not use this function. Use avcodec_free_context() to destroy a
 * codec context (either open or closed). Opening and closing a codec context
 * multiple times is not supported anymore -- use multiple codec contexts
 * instead.
 */
avcodec_close(avctx: number): Promise<number>;
/**
 * @return descriptor for given codec ID or NULL if no descriptor exists.
 */
avcodec_descriptor_get(id: number): Promise<number>;
/**
 * @return codec descriptor with the given name or NULL if no such descriptor
 *         exists.
 */
avcodec_descriptor_get_by_name(name: string): Promise<number>;
/**
 * Iterate over all codec descriptors known to libavcodec.
 *
 * @param prev previous descriptor. NULL to get the first descriptor.
 *
 * @return next descriptor or NULL after the last descriptor
 */
avcodec_descriptor_next(prev: number): Promise<number>;
/**
 * Find a registered decoder with a matching codec ID.
 *
 * @param id AVCodecID of the requested decoder
 * @return A decoder if one was found, NULL otherwise.
 */
avcodec_find_decoder(id: number): Promise<number>;
/**
 * Find a registered decoder with the specified name.
 *
 * @param name name of the requested decoder
 * @return A decoder if one was found, NULL otherwise.
 */
avcodec_find_decoder_by_name(name: string): Promise<number>;
/**
 * Find a registered encoder with a matching codec ID.
 *
 * @param id AVCodecID of the requested encoder
 * @return An encoder if one was found, NULL otherwise.
 */
avcodec_find_encoder(id: number): Promise<number>;
/**
 * Find a registered encoder with the specified name.
 *
 * @param name name of the requested encoder
 * @return An encoder if one was found, NULL otherwise.
 */
avcodec_find_encoder_by_name(name: string): Promise<number>;
/**
 * Free the codec context and everything associated with it and write NULL to
 * the provided pointer.
 */
avcodec_free_context(avctx: number): Promise<void>;
/**
 * Get the name of a codec.
 * @return  a static string identifying the codec; never NULL
 */
avcodec_get_name(id: number): Promise<string>;
/**
 * Initialize the AVCodecContext to use the given AVCodec. Prior to using this
 * function the context has to be allocated with avcodec_alloc_context3().
 *
 * The functions avcodec_find_decoder_by_name(), avcodec_find_encoder_by_name(),
 * avcodec_find_decoder() and avcodec_find_encoder() provide an easy way for
 * retrieving a codec.
 *
 * @note Always call this function before using decoding routines (such as
 * @ref avcodec_receive_frame()).
 *
 * @code
 * av_dict_set(&opts, "b", "2.5M", 0);
 * codec = avcodec_find_decoder(AV_CODEC_ID_H264);
 * if (!codec)
 *     exit(1);
 *
 * context = avcodec_alloc_context3(codec);
 *
 * if (avcodec_open2(context, codec, opts) < 0)
 *     exit(1);
 * @endcode
 *
 * @param avctx The context to initialize.
 * @param codec The codec to open this context for. If a non-NULL codec has been
 *              previously passed to avcodec_alloc_context3() or
 *              for this context, then this parameter MUST be either NULL or
 *              equal to the previously passed codec.
 * @param options A dictionary filled with AVCodecContext and codec-private options.
 *                On return this object will be filled with options that were not found.
 *
 * @return zero on success, a negative value on error
 * @see avcodec_alloc_context3(), avcodec_find_decoder(), avcodec_find_encoder(),
 *      av_dict_set(), av_opt_find().
 */
avcodec_open2(avctx: number,codec: number,options: number): Promise<number>;
/**
 * Initialize the AVCodecContext to use the given AVCodec. Prior to using this
 * function the context has to be allocated with avcodec_alloc_context3().
 *
 * The functions avcodec_find_decoder_by_name(), avcodec_find_encoder_by_name(),
 * avcodec_find_decoder() and avcodec_find_encoder() provide an easy way for
 * retrieving a codec.
 *
 * @note Always call this function before using decoding routines (such as
 * @ref avcodec_receive_frame()).
 *
 * @code
 * av_dict_set(&opts, "b", "2.5M", 0);
 * codec = avcodec_find_decoder(AV_CODEC_ID_H264);
 * if (!codec)
 *     exit(1);
 *
 * context = avcodec_alloc_context3(codec);
 *
 * if (avcodec_open2(context, codec, opts) < 0)
 *     exit(1);
 * @endcode
 *
 * @param avctx The context to initialize.
 * @param codec The codec to open this context for. If a non-NULL codec has been
 *              previously passed to avcodec_alloc_context3() or
 *              for this context, then this parameter MUST be either NULL or
 *              equal to the previously passed codec.
 * @param options A dictionary filled with AVCodecContext and codec-private options.
 *                On return this object will be filled with options that were not found.
 *
 * @return zero on success, a negative value on error
 * @see avcodec_alloc_context3(), avcodec_find_decoder(), avcodec_find_encoder(),
 *      av_dict_set(), av_opt_find().
 */
avcodec_open2_js(avctx: number,codec: number,options: number): Promise<number>;
/**
 * Allocate a new AVCodecParameters and set its fields to default values
 * (unknown/invalid/0). The returned struct must be freed with
 * avcodec_parameters_free().
 */
avcodec_parameters_alloc(): Promise<number>;
/**
 * Copy the contents of src to dst. Any allocated fields in dst are freed and
 * replaced with newly allocated duplicates of the corresponding fields in src.
 *
 * @return >= 0 on success, a negative AVERROR code on failure.
 */
avcodec_parameters_copy(dst: number,src: number): Promise<number>;
/**
 * Free an AVCodecParameters instance and everything associated with it and
 * write NULL to the supplied pointer.
 */
avcodec_parameters_free(par: number): Promise<void>;
/**
 * Fill the parameters struct based on the values from the supplied codec
 * context. Any allocated fields in par are freed and replaced with duplicates
 * of the corresponding fields in codec.
 *
 * @return >= 0 on success, a negative AVERROR code on failure
 */
avcodec_parameters_from_context(par: number,codec: number): Promise<number>;
/**
 * Fill the codec context based on the values from the supplied codec
 * parameters. Any allocated fields in codec that have a corresponding field in
 * par are freed and replaced with duplicates of the corresponding field in par.
 * Fields in codec that do not have a counterpart in par are not touched.
 *
 * @return >= 0 on success, a negative AVERROR code on failure.
 */
avcodec_parameters_to_context(codec: number,par: number): Promise<number>;
/**
 * Return decoded output data from a decoder or encoder (when the
 * AV_CODEC_FLAG_RECON_FRAME flag is used).
 *
 * @param avctx codec context
 * @param frame This will be set to a reference-counted video or audio
 *              frame (depending on the decoder type) allocated by the
 *              codec. Note that the function will always call
 *              av_frame_unref(frame) before doing anything else.
 *
 * @retval 0                success, a frame was returned
 * @retval AVERROR(EAGAIN)  output is not available in this state - user must
 *                          try to send new input
 * @retval AVERROR_EOF      the codec has been fully flushed, and there will be
 *                          no more output frames
 * @retval AVERROR(EINVAL)  codec not opened, or it is an encoder without the
 *                          AV_CODEC_FLAG_RECON_FRAME flag enabled
 * @retval AVERROR_INPUT_CHANGED current decoded frame has changed parameters with
 *                          respect to first decoded frame. Applicable when flag
 *                          AV_CODEC_FLAG_DROPCHANGED is set.
 * @retval "other negative error code" legitimate decoding errors
 */
avcodec_receive_frame(avctx: number,frame: number): Promise<number>;
/**
 * Read encoded data from the encoder.
 *
 * @param avctx codec context
 * @param avpkt This will be set to a reference-counted packet allocated by the
 *              encoder. Note that the function will always call
 *              av_packet_unref(avpkt) before doing anything else.
 * @retval 0               success
 * @retval AVERROR(EAGAIN) output is not available in the current state - user must
 *                         try to send input
 * @retval AVERROR_EOF     the encoder has been fully flushed, and there will be no
 *                         more output packets
 * @retval AVERROR(EINVAL) codec not opened, or it is a decoder
 * @retval "another negative error code" legitimate encoding errors
 */
avcodec_receive_packet(avctx: number,avpkt: number): Promise<number>;
/**
 * Supply a raw video or audio frame to the encoder. Use avcodec_receive_packet()
 * to retrieve buffered output packets.
 *
 * @param avctx     codec context
 * @param[in] frame AVFrame containing the raw audio or video frame to be encoded.
 *                  Ownership of the frame remains with the caller, and the
 *                  encoder will not write to the frame. The encoder may create
 *                  a reference to the frame data (or copy it if the frame is
 *                  not reference-counted).
 *                  It can be NULL, in which case it is considered a flush
 *                  packet.  This signals the end of the stream. If the encoder
 *                  still has packets buffered, it will return them after this
 *                  call. Once flushing mode has been entered, additional flush
 *                  packets are ignored, and sending frames will return
 *                  AVERROR_EOF.
 *
 *                  For audio:
 *                  If AV_CODEC_CAP_VARIABLE_FRAME_SIZE is set, then each frame
 *                  can have any number of samples.
 *                  If it is not set, frame->nb_samples must be equal to
 *                  avctx->frame_size for all frames except the last.
 *                  The final frame may be smaller than avctx->frame_size.
 * @retval 0                 success
 * @retval AVERROR(EAGAIN)   input is not accepted in the current state - user must
 *                           read output with avcodec_receive_packet() (once all
 *                           output is read, the packet should be resent, and the
 *                           call will not fail with EAGAIN).
 * @retval AVERROR_EOF       the encoder has been flushed, and no new frames can
 *                           be sent to it
 * @retval AVERROR(EINVAL)   codec not opened, it is a decoder, or requires flush
 * @retval AVERROR(ENOMEM)   failed to add packet to internal queue, or similar
 * @retval "another negative error code" legitimate encoding errors
 */
avcodec_send_frame(avctx: number,frame: number): Promise<number>;
/**
 * Supply raw packet data as input to a decoder.
 *
 * Internally, this call will copy relevant AVCodecContext fields, which can
 * influence decoding per-packet, and apply them when the packet is actually
 * decoded. (For example AVCodecContext.skip_frame, which might direct the
 * decoder to drop the frame contained by the packet sent with this function.)
 *
 * @warning The input buffer, avpkt->data must be AV_INPUT_BUFFER_PADDING_SIZE
 *          larger than the actual read bytes because some optimized bitstream
 *          readers read 32 or 64 bits at once and could read over the end.
 *
 * @note The AVCodecContext MUST have been opened with @ref avcodec_open2()
 *       before packets may be fed to the decoder.
 *
 * @param avctx codec context
 * @param[in] avpkt The input AVPacket. Usually, this will be a single video
 *                  frame, or several complete audio frames.
 *                  Ownership of the packet remains with the caller, and the
 *                  decoder will not write to the packet. The decoder may create
 *                  a reference to the packet data (or copy it if the packet is
 *                  not reference-counted).
 *                  Unlike with older APIs, the packet is always fully consumed,
 *                  and if it contains multiple frames (e.g. some audio codecs),
 *                  will require you to call avcodec_receive_frame() multiple
 *                  times afterwards before you can send a new packet.
 *                  It can be NULL (or an AVPacket with data set to NULL and
 *                  size set to 0); in this case, it is considered a flush
 *                  packet, which signals the end of the stream. Sending the
 *                  first flush packet will return success. Subsequent ones are
 *                  unnecessary and will return AVERROR_EOF. If the decoder
 *                  still has frames buffered, it will return them after sending
 *                  a flush packet.
 *
 * @retval 0                 success
 * @retval AVERROR(EAGAIN)   input is not accepted in the current state - user
 *                           must read output with avcodec_receive_frame() (once
 *                           all output is read, the packet should be resent,
 *                           and the call will not fail with EAGAIN).
 * @retval AVERROR_EOF       the decoder has been flushed, and no new packets can be
 *                           sent to it (also returned if more than 1 flush
 *                           packet is sent)
 * @retval AVERROR(EINVAL)   codec not opened, it is an encoder, or requires flush
 * @retval AVERROR(ENOMEM)   failed to add packet to internal queue, or similar
 * @retval "another negative error code" legitimate decoding errors
 */
avcodec_send_packet(avctx: number,avpkt: number): Promise<number>;
/**
 * Find AVInputFormat based on the short name of the input format.
 */
av_find_input_format(short_name: string): Promise<number>;
/**
 * Allocate an AVFormatContext.
 * avformat_free_context() can be used to free the context and everything
 * allocated by the framework within it.
 */
avformat_alloc_context(): Promise<number>;
/**
 * Allocate an AVFormatContext for an output format.
 * avformat_free_context() can be used to free the context and
 * everything allocated by the framework within it.
 *
 * @param ctx           pointee is set to the created format context,
 *                      or to NULL in case of failure
 * @param oformat       format to use for allocating the context, if NULL
 *                      format_name and filename are used instead
 * @param format_name   the name of output format to use for allocating the
 *                      context, if NULL filename is used instead
 * @param filename      the name of the filename to use for allocating the
 *                      context, may be NULL
 *
 * @return  >= 0 in case of success, a negative AVERROR code in case of
 *          failure
 */
avformat_alloc_output_context2_js(ctx: number,oformat: string,format_name: string): Promise<number>;
/**
 * Close an opened input AVFormatContext. Free it and all its contents
 * and set *s to NULL.
 */
avformat_close_input(s: number): Promise<void>;
/**
 * Read packets of a media file to get stream information. This
 * is useful for file formats with no headers such as MPEG. This
 * function also computes the real framerate in case of MPEG-2 repeat
 * frame mode.
 * The logical file position is not changed by this function;
 * examined packets may be buffered for later processing.
 *
 * @param ic media file handle
 * @param options  If non-NULL, an ic.nb_streams long array of pointers to
 *                 dictionaries, where i-th member contains options for
 *                 codec corresponding to i-th stream.
 *                 On return each dictionary will be filled with options that were not found.
 * @return >=0 if OK, AVERROR_xxx on error
 *
 * @note this function isn't guaranteed to open all the codecs, so
 *       options being non-empty at return is a perfectly normal behavior.
 *
 * @todo Let the user decide somehow what information is needed so that
 *       we do not waste time getting stuff the user does not need.
 */
avformat_find_stream_info(ic: number,options: number): Promise<number>;
/**
 * Discard all internally buffered data. This can be useful when dealing with
 * discontinuities in the byte stream. Generally works only with formats that
 * can resync. This includes headerless formats like MPEG-TS/TS but should also
 * work with NUT, Ogg and in a limited way AVI for example.
 *
 * The set of streams, the detected duration, stream parameters and codecs do
 * not change when calling this function. If you want a complete reset, it's
 * better to open a new AVFormatContext.
 *
 * This does not flush the AVIOContext (s->pb). If necessary, call
 * avio_flush(s->pb) before calling this function.
 *
 * @param s media file handle
 * @return >=0 on success, error code otherwise
 */
avformat_flush(s: number): Promise<number>;
/**
 * Free an AVFormatContext and all its streams.
 * @param s context to free
 */
avformat_free_context(s: number): Promise<void>;
/**
 * Add a new stream to a media file.
 *
 * When demuxing, it is called by the demuxer in read_header(). If the
 * flag AVFMTCTX_NOHEADER is set in s.ctx_flags, then it may also
 * be called in read_packet().
 *
 * When muxing, should be called by the user before avformat_write_header().
 *
 * User is required to call avformat_free_context() to clean up the allocation
 * by avformat_new_stream().
 *
 * @param s media file handle
 * @param c unused, does nothing
 *
 * @return newly created stream or NULL on error.
 */
avformat_new_stream(s: number,c: number): Promise<number>;
/**
 * Open an input stream and read the header. The codecs are not opened.
 * The stream must be closed with avformat_close_input().
 *
 * @param ps       Pointer to user-supplied AVFormatContext (allocated by
 *                 avformat_alloc_context). May be a pointer to NULL, in
 *                 which case an AVFormatContext is allocated by this
 *                 function and written into ps.
 *                 Note that a user-supplied AVFormatContext will be freed
 *                 on failure.
 * @param url      URL of the stream to open.
 * @param fmt      If non-NULL, this parameter forces a specific input format.
 *                 Otherwise the format is autodetected.
 * @param options  A dictionary filled with AVFormatContext and demuxer-private
 *                 options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @return 0 on success, a negative AVERROR on failure.
 *
 * @note If you want to use custom IO, preallocate the format context and set its pb field.
 */
avformat_open_input(ps: number,url: string,fmt: number,options: number): Promise<number>;
/**
 * Open an input stream and read the header. The codecs are not opened.
 * The stream must be closed with avformat_close_input().
 *
 * @param ps       Pointer to user-supplied AVFormatContext (allocated by
 *                 avformat_alloc_context). May be a pointer to NULL, in
 *                 which case an AVFormatContext is allocated by this
 *                 function and written into ps.
 *                 Note that a user-supplied AVFormatContext will be freed
 *                 on failure.
 * @param url      URL of the stream to open.
 * @param fmt      If non-NULL, this parameter forces a specific input format.
 *                 Otherwise the format is autodetected.
 * @param options  A dictionary filled with AVFormatContext and demuxer-private
 *                 options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @return 0 on success, a negative AVERROR on failure.
 *
 * @note If you want to use custom IO, preallocate the format context and set its pb field.
 */
avformat_open_input_js(ps: string,url: number,fmt: number): Promise<number>;
/**
 * Allocate the stream private data and write the stream header to
 * an output media file.
 *
 * @param s        Media file handle, must be allocated with
 *                 avformat_alloc_context().
 *                 Its \ref AVFormatContext.oformat "oformat" field must be set
 *                 to the desired output format;
 *                 Its \ref AVFormatContext.pb "pb" field must be set to an
 *                 already opened ::AVIOContext.
 * @param options  An ::AVDictionary filled with AVFormatContext and
 *                 muxer-private options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @retval AVSTREAM_INIT_IN_WRITE_HEADER On success, if the codec had not already been
 *                                       fully initialized in avformat_init_output().
 * @retval AVSTREAM_INIT_IN_INIT_OUTPUT  On success, if the codec had already been fully
 *                                       initialized in avformat_init_output().
 * @retval AVERROR                       A negative AVERROR on failure.
 *
 * @see av_opt_find, av_dict_set, avio_open, av_oformat_next, avformat_init_output.
 */
avformat_write_header(s: number,options: number): Promise<number>;
/**
 * Create and initialize a AVIOContext for accessing the
 * resource indicated by url.
 * @note When the resource indicated by url has been opened in
 * read+write mode, the AVIOContext can be used only for writing.
 *
 * @param s Used to return the pointer to the created AVIOContext.
 * In case of failure the pointed to value is set to NULL.
 * @param url resource to access
 * @param flags flags which control how the resource indicated by url
 * is to be opened
 * @param int_cb an interrupt callback to be used at the protocols level
 * @param options  A dictionary filled with protocol-private options. On return
 * this parameter will be destroyed and replaced with a dict containing options
 * that were not found. May be NULL.
 * @return >= 0 in case of success, a negative value corresponding to an
 * AVERROR code in case of failure
 */
avio_open2_js(s: string,url: number,flags: number,int_cb: number): Promise<number>;
/**
 * Close the resource accessed by the AVIOContext s and free it.
 * This function can only be used if s was opened by avio_open().
 *
 * The internal buffer is automatically flushed before closing the
 * resource.
 *
 * @return 0 on success, an AVERROR < 0 on error.
 * @see avio_closep
 */
avio_close(s: number): Promise<number>;
/**
 * Force flushing of buffered data.
 *
 * For write streams, force the buffered data to be immediately written to the output,
 * without to wait to fill the internal buffer.
 *
 * For read streams, discard all currently buffered data, and advance the
 * reported file position to that of the underlying stream. This does not
 * read new data, and does not perform any seeks.
 */
avio_flush(s: number): Promise<void>;
/**
 * Find the "best" stream in the file.
 * The best stream is determined according to various heuristics as the most
 * likely to be what the user expects.
 * If the decoder parameter is non-NULL, av_find_best_stream will find the
 * default decoder for the stream's codec; streams for which no decoder can
 * be found are ignored.
 *
 * @param ic                media file handle
 * @param type              stream type: video, audio, subtitles, etc.
 * @param wanted_stream_nb  user-requested stream number,
 *                          or -1 for automatic selection
 * @param related_stream    try to find a stream related (eg. in the same
 *                          program) to this one, or -1 if none
 * @param decoder_ret       if non-NULL, returns the decoder for the
 *                          selected stream
 * @param flags             flags; none are currently defined
 *
 * @return  the non-negative stream number in case of success,
 *          AVERROR_STREAM_NOT_FOUND if no stream with the requested type
 *          could be found,
 *          AVERROR_DECODER_NOT_FOUND if streams were found but no decoder
 *
 * @note  If av_find_best_stream returns successfully and decoder_ret is not
 *        NULL, then *decoder_ret is guaranteed to be set to a valid AVCodec.
 */
av_find_best_stream(ic: number,type: number,wanted_stream_nb: number,related_stream: number,decoder_ret: number,flags: number): Promise<number>;
/**
 * Return the name of sample_fmt, or NULL if sample_fmt is not
 * recognized.
 */
av_get_sample_fmt_name(sample_fmt: number): Promise<string>;
/**
 * Increase packet size, correctly zeroing padding
 *
 * @param pkt packet
 * @param grow_by number of bytes by which to increase the size of the packet
 */
av_grow_packet(pkt: number,grow_by: number): Promise<number>;
/**
 * Write a packet to an output media file ensuring correct interleaving.
 *
 * This function will buffer the packets internally as needed to make sure the
 * packets in the output file are properly interleaved, usually ordered by
 * increasing dts. Callers doing their own interleaving should call
 * av_write_frame() instead of this function.
 *
 * Using this function instead of av_write_frame() can give muxers advance
 * knowledge of future packets, improving e.g. the behaviour of the mp4
 * muxer for VFR content in fragmenting mode.
 *
 * @param s media file handle
 * @param pkt The packet containing the data to be written.
 *            <br>
 *            If the packet is reference-counted, this function will take
 *            ownership of this reference and unreference it later when it sees
 *            fit. If the packet is not reference-counted, libavformat will
 *            make a copy.
 *            The returned packet will be blank (as if returned from
 *            av_packet_alloc()), even on error.
 *            <br>
 *            This parameter can be NULL (at any time, not just at the end), to
 *            flush the interleaving queues.
 *            <br>
 *            Packet's @ref AVPacket.stream_index "stream_index" field must be
 *            set to the index of the corresponding stream in @ref
 *            AVFormatContext.streams "s->streams".
 *            <br>
 *            The timestamps (@ref AVPacket.pts "pts", @ref AVPacket.dts "dts")
 *            must be set to correct values in the stream's timebase (unless the
 *            output format is flagged with the AVFMT_NOTIMESTAMPS flag, then
 *            they can be set to AV_NOPTS_VALUE).
 *            The dts for subsequent packets in one stream must be strictly
 *            increasing (unless the output format is flagged with the
 *            AVFMT_TS_NONSTRICT, then they merely have to be nondecreasing).
 *            @ref AVPacket.duration "duration" should also be set if known.
 *
 * @return 0 on success, a negative AVERROR on error.
 *
 * @see av_write_frame(), AVFormatContext.max_interleave_delta
 */
av_interleaved_write_frame(s: number,pkt: number): Promise<number>;
/**
 * Create a writable reference for the data described by a given packet,
 * avoiding data copy if possible.
 *
 * @param pkt Packet whose data should be made writable.
 *
 * @return 0 on success, a negative AVERROR on failure. On failure, the
 *         packet is unchanged.
 */
av_packet_make_writable(pkt: number): Promise<number>;
/**
 * @return a pixel format descriptor for provided pixel format or NULL if
 * this pixel format is unknown.
 */
av_pix_fmt_desc_get(pix_fmt: number): Promise<number>;
/**
 * Return the next frame of a stream.
 * This function returns what is stored in the file, and does not validate
 * that what is there are valid frames for the decoder. It will split what is
 * stored in the file into frames and return one for each call. It will not
 * omit invalid data between valid frames so as to give the decoder the maximum
 * information possible for decoding.
 *
 * On success, the returned packet is reference-counted (pkt->buf is set) and
 * valid indefinitely. The packet must be freed with av_packet_unref() when
 * it is no longer needed. For video, the packet contains exactly one frame.
 * For audio, it contains an integer number of frames if each frame has
 * a known fixed size (e.g. PCM or ADPCM data). If the audio frames have
 * a variable size (e.g. MPEG audio), then it contains one frame.
 *
 * pkt->pts, pkt->dts and pkt->duration are always set to correct
 * values in AVStream.time_base units (and guessed if the format cannot
 * provide them). pkt->pts can be AV_NOPTS_VALUE if the video format
 * has B-frames, so it is better to rely on pkt->dts if you do not
 * decompress the payload.
 *
 * @return 0 if OK, < 0 on error or end of file. On error, pkt will be blank
 *         (as if it came from av_packet_alloc()).
 *
 * @note pkt will be initialized, so it may be uninitialized, but it must not
 *       contain data that needs to be freed.
 */
av_read_frame(s: number,pkt: number): Promise<number>;
/**
 * Reduce packet size, correctly zeroing padding
 *
 * @param pkt packet
 * @param size new size
 */
av_shrink_packet(pkt: number,size: number): Promise<void>;
/**
 * Write a packet to an output media file.
 *
 * This function passes the packet directly to the muxer, without any buffering
 * or reordering. The caller is responsible for correctly interleaving the
 * packets if the format requires it. Callers that want libavformat to handle
 * the interleaving should call av_interleaved_write_frame() instead of this
 * function.
 *
 * @param s media file handle
 * @param pkt The packet containing the data to be written. Note that unlike
 *            av_interleaved_write_frame(), this function does not take
 *            ownership of the packet passed to it (though some muxers may make
 *            an internal reference to the input packet).
 *            <br>
 *            This parameter can be NULL (at any time, not just at the end), in
 *            order to immediately flush data buffered within the muxer, for
 *            muxers that buffer up data internally before writing it to the
 *            output.
 *            <br>
 *            Packet's @ref AVPacket.stream_index "stream_index" field must be
 *            set to the index of the corresponding stream in @ref
 *            AVFormatContext.streams "s->streams".
 *            <br>
 *            The timestamps (@ref AVPacket.pts "pts", @ref AVPacket.dts "dts")
 *            must be set to correct values in the stream's timebase (unless the
 *            output format is flagged with the AVFMT_NOTIMESTAMPS flag, then
 *            they can be set to AV_NOPTS_VALUE).
 *            The dts for subsequent packets passed to this function must be strictly
 *            increasing when compared in their respective timebases (unless the
 *            output format is flagged with the AVFMT_TS_NONSTRICT, then they
 *            merely have to be nondecreasing).  @ref AVPacket.duration
 *            "duration") should also be set if known.
 * @return < 0 on error, = 0 if OK, 1 if flushed and there is no more data to flush
 *
 * @see av_interleaved_write_frame()
 */
av_write_frame(s: number,pkt: number): Promise<number>;
/**
 * Write the stream trailer to an output media file and free the
 * file private data.
 *
 * May only be called after a successful call to avformat_write_header.
 *
 * @param s media file handle
 * @return 0 if OK, AVERROR_xxx on error
 */
av_write_trailer(s: number): Promise<number>;
/**
 * Copy entries from one AVDictionary struct into another.
 *
 * @note Metadata is read using the ::AV_DICT_IGNORE_SUFFIX flag
 *
 * @param dst   Pointer to a pointer to a AVDictionary struct to copy into. If *dst is NULL,
 *              this function will allocate a struct for you and put it in *dst
 * @param src   Pointer to the source AVDictionary struct to copy items from.
 * @param flags Flags to use when setting entries in *dst
 *
 * @return 0 on success, negative AVERROR code on failure. If dst was allocated
 *           by this function, callers should free the associated memory.
 */
av_dict_copy_js(dst: number,src: number,flags: number): Promise<number>;
/**
 * Free all the memory allocated for an AVDictionary struct
 * and all keys and values.
 */
av_dict_free(m: number): Promise<void>;
/**
 * Set the given entry in *pm, overwriting an existing entry.
 *
 * Note: If AV_DICT_DONT_STRDUP_KEY or AV_DICT_DONT_STRDUP_VAL is set,
 * these arguments will be freed on error.
 *
 * @warning Adding a new entry to a dictionary invalidates all existing entries
 * previously returned with av_dict_get() or av_dict_iterate().
 *
 * @param pm        Pointer to a pointer to a dictionary struct. If *pm is NULL
 *                  a dictionary struct is allocated and put in *pm.
 * @param key       Entry key to add to *pm (will either be av_strduped or added as a new key depending on flags)
 * @param value     Entry value to add to *pm (will be av_strduped or added as a new key depending on flags).
 *                  Passing a NULL value will cause an existing entry to be deleted.
 *
 * @return          >= 0 on success otherwise an error code <0
 */
av_dict_set_js(pm: number,key: string,value: string,flags: number): Promise<number>;
/**
 * Allocate and return an SwsContext. You need it to perform
 * scaling/conversion operations using sws_scale().
 *
 * @param srcW the width of the source image
 * @param srcH the height of the source image
 * @param srcFormat the source image format
 * @param dstW the width of the destination image
 * @param dstH the height of the destination image
 * @param dstFormat the destination image format
 * @param flags specify which algorithm and options to use for rescaling
 * @param param extra parameters to tune the used scaler
 *              For SWS_BICUBIC param[0] and [1] tune the shape of the basis
 *              function, param[0] tunes f(1) and param[1] f´(1)
 *              For SWS_GAUSS param[0] tunes the exponent and thus cutoff
 *              frequency
 *              For SWS_LANCZOS param[0] tunes the width of the window function
 * @return a pointer to an allocated context, or NULL in case of error
 * @note this function is to be removed after a saner alternative is
 *       written
 */
sws_getContext(srcW: number,srcH: number,srcFormat: number,dstW: number,dstH: number,dstFormat: number,flags: number,srcFilter: number,dstFilter: number,param: number): Promise<number>;
/**
 * Free the swscaler context swsContext.
 * If swsContext is NULL, then does nothing.
 */
sws_freeContext(swsContext: number): Promise<void>;
/**
 * Scale source data from src and write the output to dst.
 *
 * This is merely a convenience wrapper around
 * - sws_frame_start()
 * - sws_send_slice(0, src->height)
 * - sws_receive_slice(0, dst->height)
 * - sws_frame_end()
 *
 * @param c   The scaling context
 * @param dst The destination frame. See documentation for sws_frame_start() for
 *            more details.
 * @param src The source frame.
 *
 * @return 0 on success, a negative AVERROR code on failure
 */
sws_scale_frame(c: number,dst: number,src: number): Promise<number>;
AVPacketSideData_data(a0: number,a1: number): Promise<number>;
AVPacketSideData_size(a0: number,a1: number): Promise<number>;
AVPacketSideData_type(a0: number,a1: number): Promise<number>;
AVPixFmtDescriptor_comp_depth(a0: number,a1: number): Promise<number>;
ff_error(a0: number): Promise<string>;
ff_nothing(): Promise<void>;
calloc(a0: number,a1: number): Promise<number>;
close(a0: number): Promise<number>;
dup2(a0: number,a1: number): Promise<number>;
free(a0: number): Promise<void>;
malloc(a0: number): Promise<number>;
mallinfo_uordblks(): Promise<number>;
open(a0: string,a1: number,a2: number): Promise<number>;
strerror(a0: number): Promise<string>;
libavjs_with_swscale(): Promise<number>;
libavjs_create_main_thread(): Promise<number>;
ffmpeg_main(a0: number,a1: number): Promise<number>;
ffprobe_main(a0: number,a1: number): Promise<number>;
AVFrame_channel_layout(ptr: number): Promise<number>;
AVFrame_channel_layout_s(ptr: number, val: number): Promise<void>;
AVFrame_channel_layouthi(ptr: number): Promise<number>;
AVFrame_channel_layouthi_s(ptr: number, val: number): Promise<void>;
AVFrame_channels(ptr: number): Promise<number>;
AVFrame_channels_s(ptr: number, val: number): Promise<void>;
AVFrame_channel_layoutmask(ptr: number): Promise<number>;
AVFrame_channel_layoutmask_s(ptr: number, val: number): Promise<void>;
AVFrame_ch_layout_nb_channels(ptr: number): Promise<number>;
AVFrame_ch_layout_nb_channels_s(ptr: number, val: number): Promise<void>;
AVFrame_crop_bottom(ptr: number): Promise<number>;
AVFrame_crop_bottom_s(ptr: number, val: number): Promise<void>;
AVFrame_crop_left(ptr: number): Promise<number>;
AVFrame_crop_left_s(ptr: number, val: number): Promise<void>;
AVFrame_crop_right(ptr: number): Promise<number>;
AVFrame_crop_right_s(ptr: number, val: number): Promise<void>;
AVFrame_crop_top(ptr: number): Promise<number>;
AVFrame_crop_top_s(ptr: number, val: number): Promise<void>;
AVFrame_data_a(ptr: number, idx: number): Promise<number>;
AVFrame_data_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVFrame_format(ptr: number): Promise<number>;
AVFrame_format_s(ptr: number, val: number): Promise<void>;
AVFrame_height(ptr: number): Promise<number>;
AVFrame_height_s(ptr: number, val: number): Promise<void>;
AVFrame_key_frame(ptr: number): Promise<number>;
AVFrame_key_frame_s(ptr: number, val: number): Promise<void>;
AVFrame_linesize_a(ptr: number, idx: number): Promise<number>;
AVFrame_linesize_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVFrame_nb_samples(ptr: number): Promise<number>;
AVFrame_nb_samples_s(ptr: number, val: number): Promise<void>;
AVFrame_pict_type(ptr: number): Promise<number>;
AVFrame_pict_type_s(ptr: number, val: number): Promise<void>;
AVFrame_pts(ptr: number): Promise<number>;
AVFrame_pts_s(ptr: number, val: number): Promise<void>;
AVFrame_ptshi(ptr: number): Promise<number>;
AVFrame_ptshi_s(ptr: number, val: number): Promise<void>;
AVFrame_sample_aspect_ratio_num(ptr: number): Promise<number>;
AVFrame_sample_aspect_ratio_num_s(ptr: number, val: number): Promise<void>;
AVFrame_sample_aspect_ratio_den(ptr: number): Promise<number>;
AVFrame_sample_aspect_ratio_den_s(ptr: number, val: number): Promise<void>;
AVFrame_sample_aspect_ratio_s(ptr: number, num: number, den: number): Promise<void>;
AVFrame_sample_rate(ptr: number): Promise<number>;
AVFrame_sample_rate_s(ptr: number, val: number): Promise<void>;
AVFrame_time_base_num(ptr: number): Promise<number>;
AVFrame_time_base_num_s(ptr: number, val: number): Promise<void>;
AVFrame_time_base_den(ptr: number): Promise<number>;
AVFrame_time_base_den_s(ptr: number, val: number): Promise<void>;
AVFrame_time_base_s(ptr: number, num: number, den: number): Promise<void>;
AVFrame_width(ptr: number): Promise<number>;
AVFrame_width_s(ptr: number, val: number): Promise<void>;
AVPixFmtDescriptor_flags(ptr: number): Promise<number>;
AVPixFmtDescriptor_flags_s(ptr: number, val: number): Promise<void>;
AVPixFmtDescriptor_log2_chroma_h(ptr: number): Promise<number>;
AVPixFmtDescriptor_log2_chroma_h_s(ptr: number, val: number): Promise<void>;
AVPixFmtDescriptor_log2_chroma_w(ptr: number): Promise<number>;
AVPixFmtDescriptor_log2_chroma_w_s(ptr: number, val: number): Promise<void>;
AVPixFmtDescriptor_nb_components(ptr: number): Promise<number>;
AVPixFmtDescriptor_nb_components_s(ptr: number, val: number): Promise<void>;
AVCodec_sample_fmts(ptr: number): Promise<number>;
AVCodec_sample_fmts_s(ptr: number, val: number): Promise<void>;
AVCodec_sample_fmts_a(ptr: number, idx: number): Promise<number>;
AVCodec_sample_fmts_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVCodec_supported_samplerates(ptr: number): Promise<number>;
AVCodec_supported_samplerates_s(ptr: number, val: number): Promise<void>;
AVCodec_supported_samplerates_a(ptr: number, idx: number): Promise<number>;
AVCodec_supported_samplerates_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVCodec_type(ptr: number): Promise<number>;
AVCodec_type_s(ptr: number, val: number): Promise<void>;
AVCodecContext_codec_id(ptr: number): Promise<number>;
AVCodecContext_codec_id_s(ptr: number, val: number): Promise<void>;
AVCodecContext_codec_type(ptr: number): Promise<number>;
AVCodecContext_codec_type_s(ptr: number, val: number): Promise<void>;
AVCodecContext_bit_rate(ptr: number): Promise<number>;
AVCodecContext_bit_rate_s(ptr: number, val: number): Promise<void>;
AVCodecContext_bit_ratehi(ptr: number): Promise<number>;
AVCodecContext_bit_ratehi_s(ptr: number, val: number): Promise<void>;
AVCodecContext_channel_layout(ptr: number): Promise<number>;
AVCodecContext_channel_layout_s(ptr: number, val: number): Promise<void>;
AVCodecContext_channel_layouthi(ptr: number): Promise<number>;
AVCodecContext_channel_layouthi_s(ptr: number, val: number): Promise<void>;
AVCodecContext_channels(ptr: number): Promise<number>;
AVCodecContext_channels_s(ptr: number, val: number): Promise<void>;
AVCodecContext_channel_layoutmask(ptr: number): Promise<number>;
AVCodecContext_channel_layoutmask_s(ptr: number, val: number): Promise<void>;
AVCodecContext_ch_layout_nb_channels(ptr: number): Promise<number>;
AVCodecContext_ch_layout_nb_channels_s(ptr: number, val: number): Promise<void>;
AVCodecContext_extradata(ptr: number): Promise<number>;
AVCodecContext_extradata_s(ptr: number, val: number): Promise<void>;
AVCodecContext_extradata_size(ptr: number): Promise<number>;
AVCodecContext_extradata_size_s(ptr: number, val: number): Promise<void>;
AVCodecContext_frame_size(ptr: number): Promise<number>;
AVCodecContext_frame_size_s(ptr: number, val: number): Promise<void>;
AVCodecContext_framerate_num(ptr: number): Promise<number>;
AVCodecContext_framerate_num_s(ptr: number, val: number): Promise<void>;
AVCodecContext_framerate_den(ptr: number): Promise<number>;
AVCodecContext_framerate_den_s(ptr: number, val: number): Promise<void>;
AVCodecContext_framerate_s(ptr: number, num: number, den: number): Promise<void>;
AVCodecContext_gop_size(ptr: number): Promise<number>;
AVCodecContext_gop_size_s(ptr: number, val: number): Promise<void>;
AVCodecContext_height(ptr: number): Promise<number>;
AVCodecContext_height_s(ptr: number, val: number): Promise<void>;
AVCodecContext_keyint_min(ptr: number): Promise<number>;
AVCodecContext_keyint_min_s(ptr: number, val: number): Promise<void>;
AVCodecContext_level(ptr: number): Promise<number>;
AVCodecContext_level_s(ptr: number, val: number): Promise<void>;
AVCodecContext_max_b_frames(ptr: number): Promise<number>;
AVCodecContext_max_b_frames_s(ptr: number, val: number): Promise<void>;
AVCodecContext_pix_fmt(ptr: number): Promise<number>;
AVCodecContext_pix_fmt_s(ptr: number, val: number): Promise<void>;
AVCodecContext_profile(ptr: number): Promise<number>;
AVCodecContext_profile_s(ptr: number, val: number): Promise<void>;
AVCodecContext_rc_max_rate(ptr: number): Promise<number>;
AVCodecContext_rc_max_rate_s(ptr: number, val: number): Promise<void>;
AVCodecContext_rc_max_ratehi(ptr: number): Promise<number>;
AVCodecContext_rc_max_ratehi_s(ptr: number, val: number): Promise<void>;
AVCodecContext_rc_min_rate(ptr: number): Promise<number>;
AVCodecContext_rc_min_rate_s(ptr: number, val: number): Promise<void>;
AVCodecContext_rc_min_ratehi(ptr: number): Promise<number>;
AVCodecContext_rc_min_ratehi_s(ptr: number, val: number): Promise<void>;
AVCodecContext_sample_aspect_ratio_num(ptr: number): Promise<number>;
AVCodecContext_sample_aspect_ratio_num_s(ptr: number, val: number): Promise<void>;
AVCodecContext_sample_aspect_ratio_den(ptr: number): Promise<number>;
AVCodecContext_sample_aspect_ratio_den_s(ptr: number, val: number): Promise<void>;
AVCodecContext_sample_aspect_ratio_s(ptr: number, num: number, den: number): Promise<void>;
AVCodecContext_sample_fmt(ptr: number): Promise<number>;
AVCodecContext_sample_fmt_s(ptr: number, val: number): Promise<void>;
AVCodecContext_sample_rate(ptr: number): Promise<number>;
AVCodecContext_sample_rate_s(ptr: number, val: number): Promise<void>;
AVCodecContext_time_base_num(ptr: number): Promise<number>;
AVCodecContext_time_base_num_s(ptr: number, val: number): Promise<void>;
AVCodecContext_time_base_den(ptr: number): Promise<number>;
AVCodecContext_time_base_den_s(ptr: number, val: number): Promise<void>;
AVCodecContext_time_base_s(ptr: number, num: number, den: number): Promise<void>;
AVCodecContext_qmax(ptr: number): Promise<number>;
AVCodecContext_qmax_s(ptr: number, val: number): Promise<void>;
AVCodecContext_qmin(ptr: number): Promise<number>;
AVCodecContext_qmin_s(ptr: number, val: number): Promise<void>;
AVCodecContext_width(ptr: number): Promise<number>;
AVCodecContext_width_s(ptr: number, val: number): Promise<void>;
AVCodecDescriptor_id(ptr: number): Promise<number>;
AVCodecDescriptor_id_s(ptr: number, val: number): Promise<void>;
AVCodecDescriptor_long_name(ptr: number): Promise<number>;
AVCodecDescriptor_long_name_s(ptr: number, val: number): Promise<void>;
AVCodecDescriptor_mime_types_a(ptr: number, idx: number): Promise<number>;
AVCodecDescriptor_mime_types_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVCodecDescriptor_name(ptr: number): Promise<number>;
AVCodecDescriptor_name_s(ptr: number, val: number): Promise<void>;
AVCodecDescriptor_props(ptr: number): Promise<number>;
AVCodecDescriptor_props_s(ptr: number, val: number): Promise<void>;
AVCodecDescriptor_type(ptr: number): Promise<number>;
AVCodecDescriptor_type_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_bit_rate(ptr: number): Promise<number>;
AVCodecParameters_bit_rate_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_channel_layoutmask(ptr: number): Promise<number>;
AVCodecParameters_channel_layoutmask_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_channels(ptr: number): Promise<number>;
AVCodecParameters_channels_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_ch_layout_nb_channels(ptr: number): Promise<number>;
AVCodecParameters_ch_layout_nb_channels_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_chroma_location(ptr: number): Promise<number>;
AVCodecParameters_chroma_location_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_codec_id(ptr: number): Promise<number>;
AVCodecParameters_codec_id_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_codec_tag(ptr: number): Promise<number>;
AVCodecParameters_codec_tag_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_codec_type(ptr: number): Promise<number>;
AVCodecParameters_codec_type_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_color_primaries(ptr: number): Promise<number>;
AVCodecParameters_color_primaries_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_color_range(ptr: number): Promise<number>;
AVCodecParameters_color_range_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_color_space(ptr: number): Promise<number>;
AVCodecParameters_color_space_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_color_trc(ptr: number): Promise<number>;
AVCodecParameters_color_trc_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_extradata(ptr: number): Promise<number>;
AVCodecParameters_extradata_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_extradata_size(ptr: number): Promise<number>;
AVCodecParameters_extradata_size_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_format(ptr: number): Promise<number>;
AVCodecParameters_format_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_framerate_num(ptr: number): Promise<number>;
AVCodecParameters_framerate_num_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_framerate_den(ptr: number): Promise<number>;
AVCodecParameters_framerate_den_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_framerate_s(ptr: number, num: number, den: number): Promise<void>;
AVCodecParameters_height(ptr: number): Promise<number>;
AVCodecParameters_height_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_level(ptr: number): Promise<number>;
AVCodecParameters_level_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_profile(ptr: number): Promise<number>;
AVCodecParameters_profile_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_sample_rate(ptr: number): Promise<number>;
AVCodecParameters_sample_rate_s(ptr: number, val: number): Promise<void>;
AVCodecParameters_width(ptr: number): Promise<number>;
AVCodecParameters_width_s(ptr: number, val: number): Promise<void>;
AVPacket_data(ptr: number): Promise<number>;
AVPacket_data_s(ptr: number, val: number): Promise<void>;
AVPacket_dts(ptr: number): Promise<number>;
AVPacket_dts_s(ptr: number, val: number): Promise<void>;
AVPacket_dtshi(ptr: number): Promise<number>;
AVPacket_dtshi_s(ptr: number, val: number): Promise<void>;
AVPacket_duration(ptr: number): Promise<number>;
AVPacket_duration_s(ptr: number, val: number): Promise<void>;
AVPacket_durationhi(ptr: number): Promise<number>;
AVPacket_durationhi_s(ptr: number, val: number): Promise<void>;
AVPacket_flags(ptr: number): Promise<number>;
AVPacket_flags_s(ptr: number, val: number): Promise<void>;
AVPacket_pos(ptr: number): Promise<number>;
AVPacket_pos_s(ptr: number, val: number): Promise<void>;
AVPacket_poshi(ptr: number): Promise<number>;
AVPacket_poshi_s(ptr: number, val: number): Promise<void>;
AVPacket_pts(ptr: number): Promise<number>;
AVPacket_pts_s(ptr: number, val: number): Promise<void>;
AVPacket_ptshi(ptr: number): Promise<number>;
AVPacket_ptshi_s(ptr: number, val: number): Promise<void>;
AVPacket_side_data(ptr: number): Promise<number>;
AVPacket_side_data_s(ptr: number, val: number): Promise<void>;
AVPacket_side_data_elems(ptr: number): Promise<number>;
AVPacket_side_data_elems_s(ptr: number, val: number): Promise<void>;
AVPacket_size(ptr: number): Promise<number>;
AVPacket_size_s(ptr: number, val: number): Promise<void>;
AVPacket_stream_index(ptr: number): Promise<number>;
AVPacket_stream_index_s(ptr: number, val: number): Promise<void>;
AVPacket_time_base_num(ptr: number): Promise<number>;
AVPacket_time_base_num_s(ptr: number, val: number): Promise<void>;
AVPacket_time_base_den(ptr: number): Promise<number>;
AVPacket_time_base_den_s(ptr: number, val: number): Promise<void>;
AVPacket_time_base_s(ptr: number, num: number, den: number): Promise<void>;
AVFormatContext_flags(ptr: number): Promise<number>;
AVFormatContext_flags_s(ptr: number, val: number): Promise<void>;
AVFormatContext_nb_streams(ptr: number): Promise<number>;
AVFormatContext_nb_streams_s(ptr: number, val: number): Promise<void>;
AVFormatContext_oformat(ptr: number): Promise<number>;
AVFormatContext_oformat_s(ptr: number, val: number): Promise<void>;
AVFormatContext_pb(ptr: number): Promise<number>;
AVFormatContext_pb_s(ptr: number, val: number): Promise<void>;
AVFormatContext_streams_a(ptr: number, idx: number): Promise<number>;
AVFormatContext_streams_a_s(ptr: number, idx: number, val: number): Promise<void>;
AVStream_codecpar(ptr: number): Promise<number>;
AVStream_codecpar_s(ptr: number, val: number): Promise<void>;
AVStream_discard(ptr: number): Promise<number>;
AVStream_discard_s(ptr: number, val: number): Promise<void>;
AVStream_duration(ptr: number): Promise<number>;
AVStream_duration_s(ptr: number, val: number): Promise<void>;
AVStream_durationhi(ptr: number): Promise<number>;
AVStream_durationhi_s(ptr: number, val: number): Promise<void>;
AVStream_time_base_num(ptr: number): Promise<number>;
AVStream_time_base_num_s(ptr: number, val: number): Promise<void>;
AVStream_time_base_den(ptr: number): Promise<number>;
AVStream_time_base_den_s(ptr: number, val: number): Promise<void>;
AVStream_time_base_s(ptr: number, num: number, den: number): Promise<void>;
AVFilterInOut_filter_ctx(ptr: number): Promise<number>;
AVFilterInOut_filter_ctx_s(ptr: number, val: number): Promise<void>;
AVFilterInOut_name(ptr: number): Promise<number>;
AVFilterInOut_name_s(ptr: number, val: number): Promise<void>;
AVFilterInOut_next(ptr: number): Promise<number>;
AVFilterInOut_next_s(ptr: number, val: number): Promise<void>;
AVFilterInOut_pad_idx(ptr: number): Promise<number>;
AVFilterInOut_pad_idx_s(ptr: number, val: number): Promise<void>;
av_frame_free_js(ptr: number): Promise<void>;
av_packet_free_js(ptr: number): Promise<void>;
avformat_close_input_js(ptr: number): Promise<void>;
avcodec_free_context_js(ptr: number): Promise<void>;
avcodec_parameters_free_js(ptr: number): Promise<void>;
avfilter_graph_free_js(ptr: number): Promise<void>;
avfilter_inout_free_js(ptr: number): Promise<void>;
av_dict_free_js(ptr: number): Promise<void>;
copyin_u8(ptr: number, arr: Uint8Array): Promise<void>;
copyout_u8(ptr: number, len: number): Promise<Uint8Array>;
copyin_s16(ptr: number, arr: Int16Array): Promise<void>;
copyout_s16(ptr: number, len: number): Promise<Int16Array>;
copyin_s32(ptr: number, arr: Int32Array): Promise<void>;
copyout_s32(ptr: number, len: number): Promise<Int32Array>;
copyin_f32(ptr: number, arr: Float32Array): Promise<void>;
copyout_f32(ptr: number, len: number): Promise<Float32Array>;

/**
 * Read a complete file from the in-memory filesystem.
 * @param name  Filename to read
 */
readFile(name: string): Promise<Uint8Array>;
/**
 * Write a complete file to the in-memory filesystem.
 * @param name  Filename to write
 * @param content  Content to write to the file
 */
writeFile(name: string, content: Uint8Array): Promise<Uint8Array>;
/**
 * Delete a file in the in-memory filesystem.
 * @param name  Filename to delete
 */
unlink(name: string): Promise<void>;
/**
 * Unmount a mounted filesystem.
 * @param mountpoint  Path where the filesystem is mounted
 */
unmount(mountpoint: string): Promise<void>;
/**
 * Make a lazy file. Direct link to createLazyFile.
 */
createLazyFile(
    parent: string, name: string, url: string, canRead: boolean,
    canWrite: boolean
): Promise<void>;
/**
 * Make a reader device.
 * @param name  Filename to create.
 * @param mode  Unix permissions (pointless since this is an in-memory
 *              filesystem)
 */
mkreaderdev(name: string, mode?: number): Promise<void>;
/**
 * Make a block reader "device". Technically a file that we then hijack to have
 * our behavior.
 * @param name  Filename to create.
 * @param size  Size of the device to present.
 */
mkblockreaderdev(name: string, size: number): Promise<void>;
/**
 * Make a readahead device. This reads a File (or other Blob) and attempts to
 * read ahead of whatever libav actually asked for. Note that this overrides
 * onblockread, so if you want to support both kinds of files, make sure you set
 * onblockread before calling this.
 * @param name  Filename to create.
 * @param file  Blob or file to read.
 */
mkreadaheadfile(name: string, file: Blob): Promise<void>;
/**
 * Make a writer device.
 * @param name  Filename to create
 * @param mode  Unix permissions
 */
mkwriterdev(name: string, mode?: number): Promise<void>;
/**
 * Make a stream writer device. The same as a writer device but does not allow
 * seeking.
 * @param name  Filename to create
 * @param mode  Unix permissions
 */
mkstreamwriterdev(name: string, mode?: number): Promise<void>;
/**
 * Mount a writer *filesystem*. All files created in this filesystem will be
 * redirected as writers. The directory will be created for you if it doesn't
 * already exist, but it may already exist.
 * @param mountpoint  Directory to mount as a writer filesystem
 */
mountwriterfs(mountpoint: string): Promise<void>;
/**
 * Make a workerfs file. Returns the filename that it's mounted to.
 * @param name  Filename to use.
 * @param blob  Blob to load at that file.
 */
mkworkerfsfile(name: string, blob: Blob): Promise<string>;
/**
 * Unmount (unmake) a workerfs file. Give the *original name you provided*, not
 * the name mkworkerfsfile returned.
 * @param name  Filename to unmount.
 */
unlinkworkerfsfile(name: string): Promise<void>;
/**
 * Send some data to a reader device. To indicate EOF, send null. To indicate an
 * error, send EOF and include an error code in the options.
 * @param name  Filename of the reader device.
 * @param data  Data to send.
 * @param opts  Optional send options, such as an error code.
 */
ff_reader_dev_send(
    name: string, data: Uint8Array | null,
    opts?: {
        errorCode?: number,
        error?: any // any other error, used internally
    }
): Promise<void>;
/**
 * Send some data to a block reader device. To indicate EOF, send null (but note
 * that block read devices have a fixed size, and will automatically send EOF
 * for reads outside of that size, so you should not normally need to send EOF).
 * To indicate an error, send EOF and include an error code in the options.
 * @param name  Filename of the reader device.
 * @param pos  Position of the data in the file.
 * @param data  Data to send.
 * @param opts  Optional send options, such as an error code.
 */
ff_block_reader_dev_send(
    name: string, pos: number, data: Uint8Array | null,
    opts?: {
        errorCode?: number,
        error?: any // any other error, used internally
    }
): Promise<void>;
/**
 * Metafunction to determine whether any device has any waiters. This can be
 * used to determine whether more data needs to be sent before a previous step
 * will be fully resolved.
 * @param name  Optional name of file to check for waiters
 */
ff_reader_dev_waiting(name?: string): Promise<boolean>;
/**
 * Metafunction to initialize an encoder with all the bells and whistles.
 * Returns [AVCodec, AVCodecContext, AVFrame, AVPacket, frame_size]
 * @param name  libav name of the codec
 * @param opts  Encoder options
 */
ff_init_encoder(
    name: string, opts?: {
        ctx?: AVCodecContextProps,
        time_base?: [number, number],
        options?: Record<string, string>
    }
): Promise<[number, number, number, number, number]>;
/**
 * Metafunction to initialize a decoder with all the bells and whistles.
 * Similar to ff_init_encoder but doesn't need to initialize the frame.
 * Returns [AVCodec, AVCodecContext, AVPacket, AVFrame]
 * @param name  libav decoder identifier or name
 * @param codecpar  Optional AVCodecParameters
 */
ff_init_decoder(
    name: string | number, codecpar?: number
): Promise<[number, number, number, number]>;
/**
 * Free everything allocated by ff_init_encoder.
 * @param c  AVCodecContext
 * @param frame  AVFrame
 * @param pkt  AVPacket
 */
ff_free_encoder(
    c: number, frame: number, pkt: number
): Promise<void>;
/**
 * Free everything allocated by ff_init_decoder
 * @param c  AVCodecContext
 * @param pkt  AVPacket
 * @param frame  AVFrame
 */
ff_free_decoder(
    c: number, pkt: number, frame: number
): Promise<void>;
/**
 * Encode some number of frames at once. Done in one go to avoid excess message
 * passing.
 * @param ctx  AVCodecContext
 * @param frame  AVFrame
 * @param pkt  AVPacket
 * @param inFrames  Array of frames in libav.js format
 * @param fin  Set to true if this is the end of encoding
 */
ff_encode_multi(
    ctx: number, frame: number, pkt: number, inFrames: (Frame | number)[],
    fin?: boolean
): Promise<Packet[]>;
/**
 * Decode some number of packets at once. Done in one go to avoid excess
 * message passing.
 * @param ctx  AVCodecContext
 * @param pkt  AVPacket
 * @param frame  AVFrame
 * @param inPackets  Incoming packets to decode
 * @param config  Decoding options. May be "true" to indicate end of stream.
 */
ff_decode_multi(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Promise<Frame[]>
ff_decode_multi(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ptr"
    }
): Promise<number[]>
ff_decode_multi(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ImageData"
    }
): Promise<ImageData[]>;
/**
 * Initialize a muxer format, format context and some number of streams.
 * Returns [AVFormatContext, AVOutputFormat, AVIOContext, AVStream[]]
 * @param opts  Muxer options
 * @param stramCtxs  Context info for each stream to mux
 */
ff_init_muxer(
    opts: {
        oformat?: number, // format pointer
        format_name?: string, // libav name
        filename?: string,
        device?: boolean, // Create a writer device
        open?: boolean, // Open the file for writing
        codecpars?: boolean // Streams is in terms of codecpars, not codecctx
    },
    streamCtxs: [number, number, number][] // AVCodecContext | AVCodecParameters, time_base_num, time_base_den
): Promise<[number, number, number, number[]]>;
/**
 * Free up a muxer format and/or file
 * @param oc  AVFormatContext
 * @param pb  AVIOContext
 */
ff_free_muxer(oc: number, pb: number): Promise<void>;
/**
 * Initialize a demuxer from a file and format context, and get the list of
 * codecs/types.
 * Returns [AVFormatContext, Stream[]]
 * @param filename  Filename to open
 * @param fmt  Format to use (optional)
 */
ff_init_demuxer_file(
    filename: string, fmt?: string
): Promise<[number, Stream[]]>;
/**
 * Write some number of packets at once.
 * @param oc  AVFormatContext
 * @param pkt  AVPacket
 * @param inPackets  Packets to write
 * @param interleave  Set to false to *not* use the interleaved writer.
 *                    Interleaving is the default.
 */
ff_write_multi(
    oc: number, pkt: number, inPackets: (Packet | number)[], interleave?: boolean
): Promise<void>;
/**
 * Read many packets at once. If you don't set any limits, this function will
 * block (asynchronously) until the whole file is read, so make sure you set
 * some limits if you want to read a bit at a time. Returns a pair [result,
 * packets], where the result indicates whether an error was encountered, an
 * EOF, or simply limits (EAGAIN), and packets is a dictionary indexed by the
 * stream number in which each element is an array of packets from that stream.
 * @param fmt_ctx  AVFormatContext
 * @param pkt  AVPacket
 * @param opts  Other options
 */
ff_read_frame_multi(
    fmt_ctx: number, pkt: number, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket?: "default" // Version of ff_copyout_packet to use
    }
): Promise<[number, Record<number, Packet[]>]>
ff_read_frame_multi(
    fmt_ctx: number, pkt: number, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket: "ptr" // Version of ff_copyout_packet to use
    }
): Promise<[number, Record<number, number[]>]>;
/**
 * @deprecated
 * DEPRECATED. Use `ff_read_frame_multi`.
 * Read many packets at once. This older API is now deprecated. The devfile
 * parameter is unused and unsupported. Dev files should be used via the normal
 * `ff_reader_dev_waiting` API, rather than counting on device file limits, as
 * this function used to.
 * @param fmt_ctx  AVFormatContext
 * @param pkt  AVPacket
 * @param devfile  Unused
 * @param opts  Other options
 */
ff_read_multi(
    fmt_ctx: number, pkt: number, devfile?: string, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket?: "default" // Version of ff_copyout_packet to use
    }
): Promise<[number, Record<number, Packet[]>]>
ff_read_multi(
    fmt_ctx: number, pkt: number, devfile?: string, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        devLimit?: number, // INPUT limit, in bytes (don't read if less than this much data is available)
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket: "ptr" // Version of ff_copyout_packet to use
    }
): Promise<[number, Record<number, number[]>]>;
/**
 * Initialize a filter graph. No equivalent free since you just need to free
 * the graph itself (av_filter_graph_free) and everything under it will be
 * freed automatically.
 * Returns [AVFilterGraph, AVFilterContext, AVFilterContext], where the second
 * and third are the input and output buffer source/sink. For multiple
 * inputs/outputs, the second and third will be arrays, as appropriate.
 * @param filters_descr  Filtergraph description
 * @param input  Input settings, or array of input settings for multiple inputs
 * @param output  Output settings, or array of output settings for multiple
 *                outputs
 */
ff_init_filter_graph(
    filters_descr: string,
    input: FilterIOSettings,
    output: FilterIOSettings
): Promise<[number, number, number]>;
ff_init_filter_graph(
    filters_descr: string,
    input: FilterIOSettings[],
    output: FilterIOSettings
): Promise<[number, number[], number]>;
ff_init_filter_graph(
    filters_descr: string,
    input: FilterIOSettings,
    output: FilterIOSettings[]
): Promise<[number, number, number[]]>;
ff_init_filter_graph(
    filters_descr: string,
    input: FilterIOSettings[],
    output: FilterIOSettings[]
): Promise<[number, number[], number[]]>;
/**
 * Filter some number of frames, possibly corresponding to multiple sources.
 * @param srcs  AVFilterContext(s), input
 * @param buffersink_ctx  AVFilterContext, output
 * @param framePtr  AVFrame
 * @param inFrames  Input frames, either as an array of frames or with frames
 *                  per input
 * @param config  Options. May be "true" to indicate end of stream.
 */
ff_filter_multi(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Promise<Frame[]>;
ff_filter_multi(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }[]
): Promise<Frame[]>
ff_filter_multi(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame: "ptr"
    }
): Promise<number[]>;
ff_filter_multi(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame: "ptr"
    }[]
): Promise<number[]>
ff_filter_multi(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame: "ImageData"
    }
): Promise<ImageData[]>;
ff_filter_multi(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame: "ImageData"
    }[]
): Promise<ImageData[]>;
/**
 * Decode and filter frames. Just a combination of ff_decode_multi and
 * ff_filter_multi that's all done on the libav.js side.
 * @param ctx  AVCodecContext
 * @param buffersrc_ctx  AVFilterContext, input
 * @param buffersink_ctx  AVFilterContext, output
 * @param pkt  AVPacket
 * @param frame  AVFrame
 * @param inPackets  Incoming packets to decode and filter
 * @param config  Decoding and filtering options. May be "true" to indicate end
 *                of stream.
 */
ff_decode_filter_multi(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Promise<Frame[]>
ff_decode_filter_multi(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ptr"
    }
): Promise<number[]>
ff_decode_filter_multi(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ImageData"
    }
): Promise<ImageData[]>;
/**
 * Copy out a frame.
 * @param frame  AVFrame
 */
ff_copyout_frame(frame: number): Promise<Frame>;
/**
 * Copy out a video frame. `ff_copyout_frame` will copy out a video frame if a
 * video frame is found, but this may be faster if you know it's a video frame.
 * @param frame  AVFrame
 */
ff_copyout_frame_video(frame: number): Promise<Frame>;
/**
 * Get the size of a packed video frame in its native format.
 * @param frame  AVFrame
 */
ff_frame_video_packed_size(frame: number): Promise<Frame>;
/**
 * Copy out a video frame, as a single packed Uint8Array.
 * @param frame  AVFrame
 */
ff_copyout_frame_video_packed(frame: number): Promise<Frame>;
/**
 * Copy out a video frame as an ImageData. The video frame *must* be RGBA for
 * this to work as expected (though some ImageData will be returned for any
 * frame).
 * @param frame  AVFrame
 */
ff_copyout_frame_video_imagedata(
    frame: number
): Promise<ImageData>;
/**
 * Copy in a frame.
 * @param framePtr  AVFrame
 * @param frame  Frame to copy in, as either a Frame or an AVFrame pointer
 */
ff_copyin_frame(framePtr: number, frame: Frame | number): Promise<void>;
/**
 * Copy out a packet.
 * @param pkt  AVPacket
 */
ff_copyout_packet(pkt: number): Promise<Packet>;
/**
 * Copy "out" a packet by just copying its data into a new AVPacket.
 * @param pkt  AVPacket
 */
ff_copyout_packet_ptr(pkt: number): Promise<number>;
/**
 * Copy in a packet.
 * @param pktPtr  AVPacket
 * @param packet  Packet to copy in, as either a Packet or an AVPacket pointer
 */
ff_copyin_packet(pktPtr: number, packet: Packet | number): Promise<void>;
/**
 * Allocate and copy in a 32-bit int list.
 * @param list  List of numbers to copy in
 */
ff_malloc_int32_list(list: number[]): Promise<number>;
/**
 * Allocate and copy in a 64-bit int list.
 * @param list  List of numbers to copy in
 */
ff_malloc_int64_list(list: number[]): Promise<number>;
/**
 * Allocate and copy in a string array. The resulting array will be
 * NULL-terminated.
 * @param arr  Array of strings to copy in.
 */
ff_malloc_string_array(arr: string[]): Promise<number>;
/**
 * Free a string array allocated by ff_malloc_string_array.
 * @param ptr  Pointer to the array to free.
 */
ff_free_string_array(ptr: number): Promise<void>;
/**
 * Frontend to the ffmpeg CLI (if it's compiled in). Pass arguments as strings,
 * or you may intermix arrays of strings for multiple arguments.
 *
 * NOTE: ffmpeg 6.0 and later require threads for the ffmpeg CLI. libav.js
 * *does* support the ffmpeg CLI on unthreaded environments, but to do so, it
 * uses an earlier version of the CLI, from 5.1.3. The libraries are still
 * modern, and if running libav.js in threaded mode, the ffmpeg CLI is modern as
 * well. As time passes, these two versions will drift apart, so make sure you
 * know whether you're running in threaded mode or not!
 */
ffmpeg(...args: (string | string[])[]): Promise<number>;
/**
 * Frontend to the ffprobe CLI (if it's compiled in). Pass arguments as strings,
 * or you may intermix arrays of strings for multiple arguments.
 */
ffprobe(...args: (string | string[])[]): Promise<number>;


    // Declarations for things that use int64, so will be communicated incorrectly

    /**
     * Seek to timestamp ts, bounded by min_ts and max_ts. All 64-bit ints are
     * in the form of low and high bits.
     */
    avformat_seek_file(
        s: number, stream_index: number, min_tslo: number, min_tshi: number,
        tslo: number, tshi: number, max_tslo: number, max_tshi: number,
        flags: number
    ): Promise<number>;

    /**
     * Seek to *at the earliest* the given timestamp.
     */
    avformat_seek_file_min(
        s: number, stream_index: number, tslo: number, tshi: number,
        flags: number
    ): Promise<number>;

    /**
     * Seek to *at the latest* the given timestamp.
     */
    avformat_seek_file_max(
        s: number, stream_index: number, tslo: number, tshi: number,
        flags: number
    ): Promise<number>;

    /**
     * Seek to as close to this timestamp as the format allows.
     */
    avformat_seek_file_approx(
        s: number, stream_index: number, tslo: number, tshi: number,
        flags: number
    ): Promise<number>;

    /**
     * Get the depth of this component of this pixel format.
     */
    AVPixFmtDescriptor_comp_depth(fmt: number, comp: number): Promise<number>;


    /**
     * Callback when writes occur. Set by the user.
     */
    onwrite?: (filename: string, position: number, buffer: Uint8Array | Int8Array) => void;

    /**
     * Callback for bock reader devices. Set by the user.
     */
    onblockread?: (filename: string, pos: number, length: number) => void;

    /**
     * Terminate the worker associated with this libav.js instance, rendering
     * it inoperable and freeing its memory.
     */
    terminate(): void;
}

/**
 * Synchronous functions, available on non-worker libav.js instances.
 */
export interface LibAVSync {
/**
 * Return number of bytes per sample.
 *
 * @param sample_fmt the sample format
 * @return number of bytes per sample or zero if unknown for the given
 * sample format
 */
av_get_bytes_per_sample_sync(sample_fmt: number): number;
/**
 * Compare two timestamps each in its own time base.
 *
 * @return One of the following values:
 *         - -1 if `ts_a` is before `ts_b`
 *         - 1 if `ts_a` is after `ts_b`
 *         - 0 if they represent the same position
 *
 * @warning
 * The result of the function is undefined if one of the timestamps is outside
 * the `int64_t` range when represented in the other's timebase.
 */
av_compare_ts_js_sync(ts_a: number,tb_a: number,ts_b: number,tb_b: number,a4: number,a5: number,a6: number,a7: number): number;
/**
 * @defgroup opt_set_funcs Option setting functions
 * @{
 * Those functions set the field of obj with the given name to value.
 *
 * @param[in] obj A struct whose first element is a pointer to an AVClass.
 * @param[in] name the name of the field to set
 * @param[in] val The value to set. In case of av_opt_set() if the field is not
 * of a string type, then the given string is parsed.
 * SI postfixes and some named scalars are supported.
 * If the field is of a numeric type, it has to be a numeric or named
 * scalar. Behavior with more than one scalar and +- infix operators
 * is undefined.
 * If the field is of a flags type, it has to be a sequence of numeric
 * scalars or named flags separated by '+' or '-'. Prefixing a flag
 * with '+' causes it to be set without affecting the other flags;
 * similarly, '-' unsets a flag.
 * If the field is of a dictionary type, it has to be a ':' separated list of
 * key=value parameters. Values containing ':' special characters must be
 * escaped.
 * @param search_flags flags passed to av_opt_find2. I.e. if AV_OPT_SEARCH_CHILDREN
 * is passed here, then the option may be set on a child of obj.
 *
 * @return 0 if the value has been set, or an AVERROR code in case of
 * error:
 * AVERROR_OPTION_NOT_FOUND if no matching option exists
 * AVERROR(ERANGE) if the value is out of range
 * AVERROR(EINVAL) if the value is not valid
 */
av_opt_set_sync(obj: number,name: string,val: string,search_flags: number): number;
av_opt_set_int_list_js_sync(a0: number,a1: string,a2: number,a3: number,a4: number,a5: number): number;
/**
 * Allocate an AVFrame and set its fields to default values.  The resulting
 * struct must be freed using av_frame_free().
 *
 * @return An AVFrame filled with default values or NULL on failure.
 *
 * @note this only allocates the AVFrame itself, not the data buffers. Those
 * must be allocated through other means, e.g. with av_frame_get_buffer() or
 * manually.
 */
av_frame_alloc_sync(): number;
/**
 * Create a new frame that references the same data as src.
 *
 * This is a shortcut for av_frame_alloc()+av_frame_ref().
 *
 * @return newly created AVFrame on success, NULL on error.
 */
av_frame_clone_sync(src: number,a1: number): number;
/**
 * Free the frame and any dynamically allocated objects in it,
 * e.g. extended_data. If the frame is reference counted, it will be
 * unreferenced first.
 *
 * @param frame frame to be freed. The pointer will be set to NULL.
 */
av_frame_free_sync(frame: number): void;
/**
 * Allocate new buffer(s) for audio or video data.
 *
 * The following fields must be set on frame before calling this function:
 * - format (pixel format for video, sample format for audio)
 * - width and height for video
 * - nb_samples and ch_layout for audio
 *
 * This function will fill AVFrame.data and AVFrame.buf arrays and, if
 * necessary, allocate and fill AVFrame.extended_data and AVFrame.extended_buf.
 * For planar formats, one buffer will be allocated for each plane.
 *
 * @warning: if frame already has been allocated, calling this function will
 *           leak memory. In addition, undefined behavior can occur in certain
 *           cases.
 *
 * @param frame frame in which to store the new buffers.
 * @param align Required buffer size alignment. If equal to 0, alignment will be
 *              chosen automatically for the current CPU. It is highly
 *              recommended to pass 0 here unless you know what you are doing.
 *
 * @return 0 on success, a negative AVERROR on error.
 */
av_frame_get_buffer_sync(frame: number,align: number): number;
/**
 * Ensure that the frame data is writable, avoiding data copy if possible.
 *
 * Do nothing if the frame is writable, allocate new buffers and copy the data
 * if it is not. Non-refcounted frames behave as non-writable, i.e. a copy
 * is always made.
 *
 * @return 0 on success, a negative AVERROR on error.
 *
 * @see av_frame_is_writable(), av_buffer_is_writable(),
 * av_buffer_make_writable()
 */
av_frame_make_writable_sync(frame: number): number;
/**
 * Set up a new reference to the data described by the source frame.
 *
 * Copy frame properties from src to dst and create a new reference for each
 * AVBufferRef from src.
 *
 * If src is not reference counted, new buffers are allocated and the data is
 * copied.
 *
 * @warning: dst MUST have been either unreferenced with av_frame_unref(dst),
 *           or newly allocated with av_frame_alloc() before calling this
 *           function, or undefined behavior will occur.
 *
 * @return 0 on success, a negative AVERROR on error
 */
av_frame_ref_sync(dst: number,src: number): number;
/**
 * Unreference all the buffers referenced by frame and reset the frame fields.
 */
av_frame_unref_sync(frame: number): void;
ff_frame_rescale_ts_js_sync(a0: number,a1: number,a2: number,a3: number,a4: number): void;
/**
 * Get the current log level
 *
 * @see lavu_log_constants
 *
 * @return Current log level
 */
av_log_get_level_sync(): number;
/**
 * Set the log level
 *
 * @see lavu_log_constants
 *
 * @param level Logging level
 */
av_log_set_level_sync(level: number): void;
/**
 * Allocate an AVPacket and set its fields to default values.  The resulting
 * struct must be freed using av_packet_free().
 *
 * @return An AVPacket filled with default values or NULL on failure.
 *
 * @note this only allocates the AVPacket itself, not the data buffers. Those
 * must be allocated through other means such as av_new_packet.
 *
 * @see av_new_packet
 */
av_packet_alloc_sync(): number;
/**
 * Create a new packet that references the same data as src.
 *
 * This is a shortcut for av_packet_alloc()+av_packet_ref().
 *
 * @return newly created AVPacket on success, NULL on error.
 *
 * @see av_packet_alloc
 * @see av_packet_ref
 */
av_packet_clone_sync(src: number): number;
/**
 * Free the packet, if the packet is reference counted, it will be
 * unreferenced first.
 *
 * @param pkt packet to be freed. The pointer will be set to NULL.
 * @note passing NULL is a no-op.
 */
av_packet_free_sync(pkt: number): void;
/**
 * Allocate new information of a packet.
 *
 * @param pkt packet
 * @param type side information type
 * @param size side information size
 * @return pointer to fresh allocated data or NULL otherwise
 */
av_packet_new_side_data_sync(pkt: number,type: number,size: number): number;
/**
 * Setup a new reference to the data described by a given packet
 *
 * If src is reference-counted, setup dst as a new reference to the
 * buffer in src. Otherwise allocate a new buffer in dst and copy the
 * data from src into it.
 *
 * All the other fields are copied from src.
 *
 * @see av_packet_unref
 *
 * @param dst Destination packet. Will be completely overwritten.
 * @param src Source packet
 *
 * @return 0 on success, a negative AVERROR on error. On error, dst
 *         will be blank (as if returned by av_packet_alloc()).
 */
av_packet_ref_sync(dst: number,src: number): number;
/**
 * Convert valid timing fields (timestamps / durations) in a packet from one
 * timebase to another. Timestamps with unknown values (AV_NOPTS_VALUE) will be
 * ignored.
 *
 * @param pkt packet on which the conversion will be performed
 * @param tb_src source timebase, in which the timing fields in pkt are
 *               expressed
 * @param tb_dst destination timebase, to which the timing fields will be
 *               converted
 */
av_packet_rescale_ts_js_sync(pkt: number,tb_src: number,tb_dst: number,a3: number,a4: number): void;
/**
 * Wipe the packet.
 *
 * Unreference the buffer referenced by the packet and reset the
 * remaining packet fields to their default values.
 *
 * @param pkt The packet to be unreferenced.
 */
av_packet_unref_sync(pkt: number): void;
/**
 * Duplicate a string.
 *
 * @param s String to be duplicated
 * @return Pointer to a newly-allocated string containing a
 *         copy of `s` or `NULL` if the string cannot be allocated
 * @see av_strndup()
 */
av_strdup_sync(s: string): number;
/**
 * Get a frame with filtered data from sink and put it in frame.
 *
 * @param ctx pointer to a context of a buffersink or abuffersink AVFilter.
 * @param frame pointer to an allocated frame that will be filled with data.
 *              The data must be freed using av_frame_unref() / av_frame_free()
 *
 * @return
 *         - >= 0 if a frame was successfully returned.
 *         - AVERROR(EAGAIN) if no frames are available at this point; more
 *           input frames must be added to the filtergraph to get more output.
 *         - AVERROR_EOF if there will be no more output frames on this sink.
 *         - A different negative AVERROR code in other failure cases.
 */
av_buffersink_get_frame_sync(ctx: number,frame: number): number;
av_buffersink_get_time_base_num_sync(a0: number): number;
av_buffersink_get_time_base_den_sync(a0: number): number;
/**
 * Set the frame size for an audio buffer sink.
 *
 * All calls to av_buffersink_get_buffer_ref will return a buffer with
 * exactly the specified number of samples, or AVERROR(EAGAIN) if there is
 * not enough. The last buffer at EOF will be padded with 0.
 */
av_buffersink_set_frame_size_sync(ctx: number,frame_size: number): void;
/**
 * Add a frame to the buffer source.
 *
 * By default, if the frame is reference-counted, this function will take
 * ownership of the reference(s) and reset the frame. This can be controlled
 * using the flags.
 *
 * If this function returns an error, the input frame is not touched.
 *
 * @param buffer_src  pointer to a buffer source context
 * @param frame       a frame, or NULL to mark EOF
 * @param flags       a combination of AV_BUFFERSRC_FLAG_*
 * @return            >= 0 in case of success, a negative AVERROR code
 *                    in case of failure
 */
av_buffersrc_add_frame_flags_sync(buffer_src: number,frame: number,flags: number): number;
/**
 * Free a filter context. This will also remove the filter from its
 * filtergraph's list of filters.
 *
 * @param filter the filter to free
 */
avfilter_free_sync(filter: number): void;
/**
 * Get a filter definition matching the given name.
 *
 * @param name the filter name to find
 * @return     the filter definition, if any matching one is registered.
 *             NULL if none found.
 */
avfilter_get_by_name_sync(name: string): number;
/**
 * Allocate a filter graph.
 *
 * @return the allocated filter graph on success or NULL.
 */
avfilter_graph_alloc_sync(): number;
/**
 * Check validity and configure all the links and formats in the graph.
 *
 * @param graphctx the filter graph
 * @param log_ctx context used for logging
 * @return >= 0 in case of success, a negative AVERROR code otherwise
 */
avfilter_graph_config_sync(graphctx: number,log_ctx: number): number;
/**
 * Create and add a filter instance into an existing graph.
 * The filter instance is created from the filter filt and inited
 * with the parameter args. opaque is currently ignored.
 *
 * In case of success put in *filt_ctx the pointer to the created
 * filter instance, otherwise set *filt_ctx to NULL.
 *
 * @param name the instance name to give to the created filter instance
 * @param graph_ctx the filter graph
 * @return a negative AVERROR error code in case of failure, a non
 * negative value otherwise
 */
avfilter_graph_create_filter_js_sync(filt_ctx: number,filt: string,name: string,args: number,opaque: number): number;
/**
 * Free a graph, destroy its links, and set *graph to NULL.
 * If *graph is NULL, do nothing.
 */
avfilter_graph_free_sync(graph: number): void;
/**
 * Add a graph described by a string to a graph.
 *
 * @note The caller must provide the lists of inputs and outputs,
 * which therefore must be known before calling the function.
 *
 * @note The inputs parameter describes inputs of the already existing
 * part of the graph; i.e. from the point of view of the newly created
 * part, they are outputs. Similarly the outputs parameter describes
 * outputs of the already existing filters, which are provided as
 * inputs to the parsed filters.
 *
 * @param graph   the filter graph where to link the parsed graph context
 * @param filters string to be parsed
 * @param inputs  linked list to the inputs of the graph
 * @param outputs linked list to the outputs of the graph
 * @return zero on success, a negative AVERROR code on error
 */
avfilter_graph_parse_sync(graph: number,filters: string,inputs: number,outputs: number,log_ctx: number): number;
/**
 * Allocate a single AVFilterInOut entry.
 * Must be freed with avfilter_inout_free().
 * @return allocated AVFilterInOut on success, NULL on failure.
 */
avfilter_inout_alloc_sync(): number;
/**
 * Free the supplied list of AVFilterInOut and set *inout to NULL.
 * If *inout is NULL, do nothing.
 */
avfilter_inout_free_sync(inout: number): void;
/**
 * Link two filters together.
 *
 * @param src    the source filter
 * @param srcpad index of the output pad on the source filter
 * @param dst    the destination filter
 * @param dstpad index of the input pad on the destination filter
 * @return       zero on success
 */
avfilter_link_sync(src: number,srcpad: number,dst: number,dstpad: number): number;
/**
 * Allocate an AVCodecContext and set its fields to default values. The
 * resulting struct should be freed with avcodec_free_context().
 *
 * @param codec if non-NULL, allocate private data and initialize defaults
 *              for the given codec. It is illegal to then call avcodec_open2()
 *              with a different codec.
 *              If NULL, then the codec-specific defaults won't be initialized,
 *              which may result in suboptimal default settings (this is
 *              important mainly for encoders, e.g. libx264).
 *
 * @return An AVCodecContext filled with default values or NULL on failure.
 */
avcodec_alloc_context3_sync(codec: number): number;
/**
 * Close a given AVCodecContext and free all the data associated with it
 * (but not the AVCodecContext itself).
 *
 * Calling this function on an AVCodecContext that hasn't been opened will free
 * the codec-specific data allocated in avcodec_alloc_context3() with a non-NULL
 * codec. Subsequent calls will do nothing.
 *
 * @note Do not use this function. Use avcodec_free_context() to destroy a
 * codec context (either open or closed). Opening and closing a codec context
 * multiple times is not supported anymore -- use multiple codec contexts
 * instead.
 */
avcodec_close_sync(avctx: number): number;
/**
 * @return descriptor for given codec ID or NULL if no descriptor exists.
 */
avcodec_descriptor_get_sync(id: number): number;
/**
 * @return codec descriptor with the given name or NULL if no such descriptor
 *         exists.
 */
avcodec_descriptor_get_by_name_sync(name: string): number;
/**
 * Iterate over all codec descriptors known to libavcodec.
 *
 * @param prev previous descriptor. NULL to get the first descriptor.
 *
 * @return next descriptor or NULL after the last descriptor
 */
avcodec_descriptor_next_sync(prev: number): number;
/**
 * Find a registered decoder with a matching codec ID.
 *
 * @param id AVCodecID of the requested decoder
 * @return A decoder if one was found, NULL otherwise.
 */
avcodec_find_decoder_sync(id: number): number;
/**
 * Find a registered decoder with the specified name.
 *
 * @param name name of the requested decoder
 * @return A decoder if one was found, NULL otherwise.
 */
avcodec_find_decoder_by_name_sync(name: string): number;
/**
 * Find a registered encoder with a matching codec ID.
 *
 * @param id AVCodecID of the requested encoder
 * @return An encoder if one was found, NULL otherwise.
 */
avcodec_find_encoder_sync(id: number): number;
/**
 * Find a registered encoder with the specified name.
 *
 * @param name name of the requested encoder
 * @return An encoder if one was found, NULL otherwise.
 */
avcodec_find_encoder_by_name_sync(name: string): number;
/**
 * Free the codec context and everything associated with it and write NULL to
 * the provided pointer.
 */
avcodec_free_context_sync(avctx: number): void;
/**
 * Get the name of a codec.
 * @return  a static string identifying the codec; never NULL
 */
avcodec_get_name_sync(id: number): string;
/**
 * Initialize the AVCodecContext to use the given AVCodec. Prior to using this
 * function the context has to be allocated with avcodec_alloc_context3().
 *
 * The functions avcodec_find_decoder_by_name(), avcodec_find_encoder_by_name(),
 * avcodec_find_decoder() and avcodec_find_encoder() provide an easy way for
 * retrieving a codec.
 *
 * @note Always call this function before using decoding routines (such as
 * @ref avcodec_receive_frame()).
 *
 * @code
 * av_dict_set(&opts, "b", "2.5M", 0);
 * codec = avcodec_find_decoder(AV_CODEC_ID_H264);
 * if (!codec)
 *     exit(1);
 *
 * context = avcodec_alloc_context3(codec);
 *
 * if (avcodec_open2(context, codec, opts) < 0)
 *     exit(1);
 * @endcode
 *
 * @param avctx The context to initialize.
 * @param codec The codec to open this context for. If a non-NULL codec has been
 *              previously passed to avcodec_alloc_context3() or
 *              for this context, then this parameter MUST be either NULL or
 *              equal to the previously passed codec.
 * @param options A dictionary filled with AVCodecContext and codec-private options.
 *                On return this object will be filled with options that were not found.
 *
 * @return zero on success, a negative value on error
 * @see avcodec_alloc_context3(), avcodec_find_decoder(), avcodec_find_encoder(),
 *      av_dict_set(), av_opt_find().
 */
avcodec_open2_sync(avctx: number,codec: number,options: number): number;
/**
 * Initialize the AVCodecContext to use the given AVCodec. Prior to using this
 * function the context has to be allocated with avcodec_alloc_context3().
 *
 * The functions avcodec_find_decoder_by_name(), avcodec_find_encoder_by_name(),
 * avcodec_find_decoder() and avcodec_find_encoder() provide an easy way for
 * retrieving a codec.
 *
 * @note Always call this function before using decoding routines (such as
 * @ref avcodec_receive_frame()).
 *
 * @code
 * av_dict_set(&opts, "b", "2.5M", 0);
 * codec = avcodec_find_decoder(AV_CODEC_ID_H264);
 * if (!codec)
 *     exit(1);
 *
 * context = avcodec_alloc_context3(codec);
 *
 * if (avcodec_open2(context, codec, opts) < 0)
 *     exit(1);
 * @endcode
 *
 * @param avctx The context to initialize.
 * @param codec The codec to open this context for. If a non-NULL codec has been
 *              previously passed to avcodec_alloc_context3() or
 *              for this context, then this parameter MUST be either NULL or
 *              equal to the previously passed codec.
 * @param options A dictionary filled with AVCodecContext and codec-private options.
 *                On return this object will be filled with options that were not found.
 *
 * @return zero on success, a negative value on error
 * @see avcodec_alloc_context3(), avcodec_find_decoder(), avcodec_find_encoder(),
 *      av_dict_set(), av_opt_find().
 */
avcodec_open2_js_sync(avctx: number,codec: number,options: number): number;
/**
 * Allocate a new AVCodecParameters and set its fields to default values
 * (unknown/invalid/0). The returned struct must be freed with
 * avcodec_parameters_free().
 */
avcodec_parameters_alloc_sync(): number;
/**
 * Copy the contents of src to dst. Any allocated fields in dst are freed and
 * replaced with newly allocated duplicates of the corresponding fields in src.
 *
 * @return >= 0 on success, a negative AVERROR code on failure.
 */
avcodec_parameters_copy_sync(dst: number,src: number): number;
/**
 * Free an AVCodecParameters instance and everything associated with it and
 * write NULL to the supplied pointer.
 */
avcodec_parameters_free_sync(par: number): void;
/**
 * Fill the parameters struct based on the values from the supplied codec
 * context. Any allocated fields in par are freed and replaced with duplicates
 * of the corresponding fields in codec.
 *
 * @return >= 0 on success, a negative AVERROR code on failure
 */
avcodec_parameters_from_context_sync(par: number,codec: number): number;
/**
 * Fill the codec context based on the values from the supplied codec
 * parameters. Any allocated fields in codec that have a corresponding field in
 * par are freed and replaced with duplicates of the corresponding field in par.
 * Fields in codec that do not have a counterpart in par are not touched.
 *
 * @return >= 0 on success, a negative AVERROR code on failure.
 */
avcodec_parameters_to_context_sync(codec: number,par: number): number;
/**
 * Return decoded output data from a decoder or encoder (when the
 * AV_CODEC_FLAG_RECON_FRAME flag is used).
 *
 * @param avctx codec context
 * @param frame This will be set to a reference-counted video or audio
 *              frame (depending on the decoder type) allocated by the
 *              codec. Note that the function will always call
 *              av_frame_unref(frame) before doing anything else.
 *
 * @retval 0                success, a frame was returned
 * @retval AVERROR(EAGAIN)  output is not available in this state - user must
 *                          try to send new input
 * @retval AVERROR_EOF      the codec has been fully flushed, and there will be
 *                          no more output frames
 * @retval AVERROR(EINVAL)  codec not opened, or it is an encoder without the
 *                          AV_CODEC_FLAG_RECON_FRAME flag enabled
 * @retval AVERROR_INPUT_CHANGED current decoded frame has changed parameters with
 *                          respect to first decoded frame. Applicable when flag
 *                          AV_CODEC_FLAG_DROPCHANGED is set.
 * @retval "other negative error code" legitimate decoding errors
 */
avcodec_receive_frame_sync(avctx: number,frame: number): number;
/**
 * Read encoded data from the encoder.
 *
 * @param avctx codec context
 * @param avpkt This will be set to a reference-counted packet allocated by the
 *              encoder. Note that the function will always call
 *              av_packet_unref(avpkt) before doing anything else.
 * @retval 0               success
 * @retval AVERROR(EAGAIN) output is not available in the current state - user must
 *                         try to send input
 * @retval AVERROR_EOF     the encoder has been fully flushed, and there will be no
 *                         more output packets
 * @retval AVERROR(EINVAL) codec not opened, or it is a decoder
 * @retval "another negative error code" legitimate encoding errors
 */
avcodec_receive_packet_sync(avctx: number,avpkt: number): number;
/**
 * Supply a raw video or audio frame to the encoder. Use avcodec_receive_packet()
 * to retrieve buffered output packets.
 *
 * @param avctx     codec context
 * @param[in] frame AVFrame containing the raw audio or video frame to be encoded.
 *                  Ownership of the frame remains with the caller, and the
 *                  encoder will not write to the frame. The encoder may create
 *                  a reference to the frame data (or copy it if the frame is
 *                  not reference-counted).
 *                  It can be NULL, in which case it is considered a flush
 *                  packet.  This signals the end of the stream. If the encoder
 *                  still has packets buffered, it will return them after this
 *                  call. Once flushing mode has been entered, additional flush
 *                  packets are ignored, and sending frames will return
 *                  AVERROR_EOF.
 *
 *                  For audio:
 *                  If AV_CODEC_CAP_VARIABLE_FRAME_SIZE is set, then each frame
 *                  can have any number of samples.
 *                  If it is not set, frame->nb_samples must be equal to
 *                  avctx->frame_size for all frames except the last.
 *                  The final frame may be smaller than avctx->frame_size.
 * @retval 0                 success
 * @retval AVERROR(EAGAIN)   input is not accepted in the current state - user must
 *                           read output with avcodec_receive_packet() (once all
 *                           output is read, the packet should be resent, and the
 *                           call will not fail with EAGAIN).
 * @retval AVERROR_EOF       the encoder has been flushed, and no new frames can
 *                           be sent to it
 * @retval AVERROR(EINVAL)   codec not opened, it is a decoder, or requires flush
 * @retval AVERROR(ENOMEM)   failed to add packet to internal queue, or similar
 * @retval "another negative error code" legitimate encoding errors
 */
avcodec_send_frame_sync(avctx: number,frame: number): number;
/**
 * Supply raw packet data as input to a decoder.
 *
 * Internally, this call will copy relevant AVCodecContext fields, which can
 * influence decoding per-packet, and apply them when the packet is actually
 * decoded. (For example AVCodecContext.skip_frame, which might direct the
 * decoder to drop the frame contained by the packet sent with this function.)
 *
 * @warning The input buffer, avpkt->data must be AV_INPUT_BUFFER_PADDING_SIZE
 *          larger than the actual read bytes because some optimized bitstream
 *          readers read 32 or 64 bits at once and could read over the end.
 *
 * @note The AVCodecContext MUST have been opened with @ref avcodec_open2()
 *       before packets may be fed to the decoder.
 *
 * @param avctx codec context
 * @param[in] avpkt The input AVPacket. Usually, this will be a single video
 *                  frame, or several complete audio frames.
 *                  Ownership of the packet remains with the caller, and the
 *                  decoder will not write to the packet. The decoder may create
 *                  a reference to the packet data (or copy it if the packet is
 *                  not reference-counted).
 *                  Unlike with older APIs, the packet is always fully consumed,
 *                  and if it contains multiple frames (e.g. some audio codecs),
 *                  will require you to call avcodec_receive_frame() multiple
 *                  times afterwards before you can send a new packet.
 *                  It can be NULL (or an AVPacket with data set to NULL and
 *                  size set to 0); in this case, it is considered a flush
 *                  packet, which signals the end of the stream. Sending the
 *                  first flush packet will return success. Subsequent ones are
 *                  unnecessary and will return AVERROR_EOF. If the decoder
 *                  still has frames buffered, it will return them after sending
 *                  a flush packet.
 *
 * @retval 0                 success
 * @retval AVERROR(EAGAIN)   input is not accepted in the current state - user
 *                           must read output with avcodec_receive_frame() (once
 *                           all output is read, the packet should be resent,
 *                           and the call will not fail with EAGAIN).
 * @retval AVERROR_EOF       the decoder has been flushed, and no new packets can be
 *                           sent to it (also returned if more than 1 flush
 *                           packet is sent)
 * @retval AVERROR(EINVAL)   codec not opened, it is an encoder, or requires flush
 * @retval AVERROR(ENOMEM)   failed to add packet to internal queue, or similar
 * @retval "another negative error code" legitimate decoding errors
 */
avcodec_send_packet_sync(avctx: number,avpkt: number): number;
/**
 * Find AVInputFormat based on the short name of the input format.
 */
av_find_input_format_sync(short_name: string): number;
/**
 * Allocate an AVFormatContext.
 * avformat_free_context() can be used to free the context and everything
 * allocated by the framework within it.
 */
avformat_alloc_context_sync(): number;
/**
 * Allocate an AVFormatContext for an output format.
 * avformat_free_context() can be used to free the context and
 * everything allocated by the framework within it.
 *
 * @param ctx           pointee is set to the created format context,
 *                      or to NULL in case of failure
 * @param oformat       format to use for allocating the context, if NULL
 *                      format_name and filename are used instead
 * @param format_name   the name of output format to use for allocating the
 *                      context, if NULL filename is used instead
 * @param filename      the name of the filename to use for allocating the
 *                      context, may be NULL
 *
 * @return  >= 0 in case of success, a negative AVERROR code in case of
 *          failure
 */
avformat_alloc_output_context2_js_sync(ctx: number,oformat: string,format_name: string): number;
/**
 * Close an opened input AVFormatContext. Free it and all its contents
 * and set *s to NULL.
 */
avformat_close_input_sync(s: number): void;
/**
 * Read packets of a media file to get stream information. This
 * is useful for file formats with no headers such as MPEG. This
 * function also computes the real framerate in case of MPEG-2 repeat
 * frame mode.
 * The logical file position is not changed by this function;
 * examined packets may be buffered for later processing.
 *
 * @param ic media file handle
 * @param options  If non-NULL, an ic.nb_streams long array of pointers to
 *                 dictionaries, where i-th member contains options for
 *                 codec corresponding to i-th stream.
 *                 On return each dictionary will be filled with options that were not found.
 * @return >=0 if OK, AVERROR_xxx on error
 *
 * @note this function isn't guaranteed to open all the codecs, so
 *       options being non-empty at return is a perfectly normal behavior.
 *
 * @todo Let the user decide somehow what information is needed so that
 *       we do not waste time getting stuff the user does not need.
 */
avformat_find_stream_info_sync(ic: number,options: number): number | Promise<number>;
/**
 * Discard all internally buffered data. This can be useful when dealing with
 * discontinuities in the byte stream. Generally works only with formats that
 * can resync. This includes headerless formats like MPEG-TS/TS but should also
 * work with NUT, Ogg and in a limited way AVI for example.
 *
 * The set of streams, the detected duration, stream parameters and codecs do
 * not change when calling this function. If you want a complete reset, it's
 * better to open a new AVFormatContext.
 *
 * This does not flush the AVIOContext (s->pb). If necessary, call
 * avio_flush(s->pb) before calling this function.
 *
 * @param s media file handle
 * @return >=0 on success, error code otherwise
 */
avformat_flush_sync(s: number): number;
/**
 * Free an AVFormatContext and all its streams.
 * @param s context to free
 */
avformat_free_context_sync(s: number): void;
/**
 * Add a new stream to a media file.
 *
 * When demuxing, it is called by the demuxer in read_header(). If the
 * flag AVFMTCTX_NOHEADER is set in s.ctx_flags, then it may also
 * be called in read_packet().
 *
 * When muxing, should be called by the user before avformat_write_header().
 *
 * User is required to call avformat_free_context() to clean up the allocation
 * by avformat_new_stream().
 *
 * @param s media file handle
 * @param c unused, does nothing
 *
 * @return newly created stream or NULL on error.
 */
avformat_new_stream_sync(s: number,c: number): number;
/**
 * Open an input stream and read the header. The codecs are not opened.
 * The stream must be closed with avformat_close_input().
 *
 * @param ps       Pointer to user-supplied AVFormatContext (allocated by
 *                 avformat_alloc_context). May be a pointer to NULL, in
 *                 which case an AVFormatContext is allocated by this
 *                 function and written into ps.
 *                 Note that a user-supplied AVFormatContext will be freed
 *                 on failure.
 * @param url      URL of the stream to open.
 * @param fmt      If non-NULL, this parameter forces a specific input format.
 *                 Otherwise the format is autodetected.
 * @param options  A dictionary filled with AVFormatContext and demuxer-private
 *                 options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @return 0 on success, a negative AVERROR on failure.
 *
 * @note If you want to use custom IO, preallocate the format context and set its pb field.
 */
avformat_open_input_sync(ps: number,url: string,fmt: number,options: number): number | Promise<number>;
/**
 * Open an input stream and read the header. The codecs are not opened.
 * The stream must be closed with avformat_close_input().
 *
 * @param ps       Pointer to user-supplied AVFormatContext (allocated by
 *                 avformat_alloc_context). May be a pointer to NULL, in
 *                 which case an AVFormatContext is allocated by this
 *                 function and written into ps.
 *                 Note that a user-supplied AVFormatContext will be freed
 *                 on failure.
 * @param url      URL of the stream to open.
 * @param fmt      If non-NULL, this parameter forces a specific input format.
 *                 Otherwise the format is autodetected.
 * @param options  A dictionary filled with AVFormatContext and demuxer-private
 *                 options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @return 0 on success, a negative AVERROR on failure.
 *
 * @note If you want to use custom IO, preallocate the format context and set its pb field.
 */
avformat_open_input_js_sync(ps: string,url: number,fmt: number): number | Promise<number>;
/**
 * Allocate the stream private data and write the stream header to
 * an output media file.
 *
 * @param s        Media file handle, must be allocated with
 *                 avformat_alloc_context().
 *                 Its \ref AVFormatContext.oformat "oformat" field must be set
 *                 to the desired output format;
 *                 Its \ref AVFormatContext.pb "pb" field must be set to an
 *                 already opened ::AVIOContext.
 * @param options  An ::AVDictionary filled with AVFormatContext and
 *                 muxer-private options.
 *                 On return this parameter will be destroyed and replaced with
 *                 a dict containing options that were not found. May be NULL.
 *
 * @retval AVSTREAM_INIT_IN_WRITE_HEADER On success, if the codec had not already been
 *                                       fully initialized in avformat_init_output().
 * @retval AVSTREAM_INIT_IN_INIT_OUTPUT  On success, if the codec had already been fully
 *                                       initialized in avformat_init_output().
 * @retval AVERROR                       A negative AVERROR on failure.
 *
 * @see av_opt_find, av_dict_set, avio_open, av_oformat_next, avformat_init_output.
 */
avformat_write_header_sync(s: number,options: number): number;
/**
 * Create and initialize a AVIOContext for accessing the
 * resource indicated by url.
 * @note When the resource indicated by url has been opened in
 * read+write mode, the AVIOContext can be used only for writing.
 *
 * @param s Used to return the pointer to the created AVIOContext.
 * In case of failure the pointed to value is set to NULL.
 * @param url resource to access
 * @param flags flags which control how the resource indicated by url
 * is to be opened
 * @param int_cb an interrupt callback to be used at the protocols level
 * @param options  A dictionary filled with protocol-private options. On return
 * this parameter will be destroyed and replaced with a dict containing options
 * that were not found. May be NULL.
 * @return >= 0 in case of success, a negative value corresponding to an
 * AVERROR code in case of failure
 */
avio_open2_js_sync(s: string,url: number,flags: number,int_cb: number): number;
/**
 * Close the resource accessed by the AVIOContext s and free it.
 * This function can only be used if s was opened by avio_open().
 *
 * The internal buffer is automatically flushed before closing the
 * resource.
 *
 * @return 0 on success, an AVERROR < 0 on error.
 * @see avio_closep
 */
avio_close_sync(s: number): number;
/**
 * Force flushing of buffered data.
 *
 * For write streams, force the buffered data to be immediately written to the output,
 * without to wait to fill the internal buffer.
 *
 * For read streams, discard all currently buffered data, and advance the
 * reported file position to that of the underlying stream. This does not
 * read new data, and does not perform any seeks.
 */
avio_flush_sync(s: number): void;
/**
 * Find the "best" stream in the file.
 * The best stream is determined according to various heuristics as the most
 * likely to be what the user expects.
 * If the decoder parameter is non-NULL, av_find_best_stream will find the
 * default decoder for the stream's codec; streams for which no decoder can
 * be found are ignored.
 *
 * @param ic                media file handle
 * @param type              stream type: video, audio, subtitles, etc.
 * @param wanted_stream_nb  user-requested stream number,
 *                          or -1 for automatic selection
 * @param related_stream    try to find a stream related (eg. in the same
 *                          program) to this one, or -1 if none
 * @param decoder_ret       if non-NULL, returns the decoder for the
 *                          selected stream
 * @param flags             flags; none are currently defined
 *
 * @return  the non-negative stream number in case of success,
 *          AVERROR_STREAM_NOT_FOUND if no stream with the requested type
 *          could be found,
 *          AVERROR_DECODER_NOT_FOUND if streams were found but no decoder
 *
 * @note  If av_find_best_stream returns successfully and decoder_ret is not
 *        NULL, then *decoder_ret is guaranteed to be set to a valid AVCodec.
 */
av_find_best_stream_sync(ic: number,type: number,wanted_stream_nb: number,related_stream: number,decoder_ret: number,flags: number): number;
/**
 * Return the name of sample_fmt, or NULL if sample_fmt is not
 * recognized.
 */
av_get_sample_fmt_name_sync(sample_fmt: number): string;
/**
 * Increase packet size, correctly zeroing padding
 *
 * @param pkt packet
 * @param grow_by number of bytes by which to increase the size of the packet
 */
av_grow_packet_sync(pkt: number,grow_by: number): number;
/**
 * Write a packet to an output media file ensuring correct interleaving.
 *
 * This function will buffer the packets internally as needed to make sure the
 * packets in the output file are properly interleaved, usually ordered by
 * increasing dts. Callers doing their own interleaving should call
 * av_write_frame() instead of this function.
 *
 * Using this function instead of av_write_frame() can give muxers advance
 * knowledge of future packets, improving e.g. the behaviour of the mp4
 * muxer for VFR content in fragmenting mode.
 *
 * @param s media file handle
 * @param pkt The packet containing the data to be written.
 *            <br>
 *            If the packet is reference-counted, this function will take
 *            ownership of this reference and unreference it later when it sees
 *            fit. If the packet is not reference-counted, libavformat will
 *            make a copy.
 *            The returned packet will be blank (as if returned from
 *            av_packet_alloc()), even on error.
 *            <br>
 *            This parameter can be NULL (at any time, not just at the end), to
 *            flush the interleaving queues.
 *            <br>
 *            Packet's @ref AVPacket.stream_index "stream_index" field must be
 *            set to the index of the corresponding stream in @ref
 *            AVFormatContext.streams "s->streams".
 *            <br>
 *            The timestamps (@ref AVPacket.pts "pts", @ref AVPacket.dts "dts")
 *            must be set to correct values in the stream's timebase (unless the
 *            output format is flagged with the AVFMT_NOTIMESTAMPS flag, then
 *            they can be set to AV_NOPTS_VALUE).
 *            The dts for subsequent packets in one stream must be strictly
 *            increasing (unless the output format is flagged with the
 *            AVFMT_TS_NONSTRICT, then they merely have to be nondecreasing).
 *            @ref AVPacket.duration "duration" should also be set if known.
 *
 * @return 0 on success, a negative AVERROR on error.
 *
 * @see av_write_frame(), AVFormatContext.max_interleave_delta
 */
av_interleaved_write_frame_sync(s: number,pkt: number): number;
/**
 * Create a writable reference for the data described by a given packet,
 * avoiding data copy if possible.
 *
 * @param pkt Packet whose data should be made writable.
 *
 * @return 0 on success, a negative AVERROR on failure. On failure, the
 *         packet is unchanged.
 */
av_packet_make_writable_sync(pkt: number): number;
/**
 * @return a pixel format descriptor for provided pixel format or NULL if
 * this pixel format is unknown.
 */
av_pix_fmt_desc_get_sync(pix_fmt: number): number;
/**
 * Return the next frame of a stream.
 * This function returns what is stored in the file, and does not validate
 * that what is there are valid frames for the decoder. It will split what is
 * stored in the file into frames and return one for each call. It will not
 * omit invalid data between valid frames so as to give the decoder the maximum
 * information possible for decoding.
 *
 * On success, the returned packet is reference-counted (pkt->buf is set) and
 * valid indefinitely. The packet must be freed with av_packet_unref() when
 * it is no longer needed. For video, the packet contains exactly one frame.
 * For audio, it contains an integer number of frames if each frame has
 * a known fixed size (e.g. PCM or ADPCM data). If the audio frames have
 * a variable size (e.g. MPEG audio), then it contains one frame.
 *
 * pkt->pts, pkt->dts and pkt->duration are always set to correct
 * values in AVStream.time_base units (and guessed if the format cannot
 * provide them). pkt->pts can be AV_NOPTS_VALUE if the video format
 * has B-frames, so it is better to rely on pkt->dts if you do not
 * decompress the payload.
 *
 * @return 0 if OK, < 0 on error or end of file. On error, pkt will be blank
 *         (as if it came from av_packet_alloc()).
 *
 * @note pkt will be initialized, so it may be uninitialized, but it must not
 *       contain data that needs to be freed.
 */
av_read_frame_sync(s: number,pkt: number): number | Promise<number>;
/**
 * Reduce packet size, correctly zeroing padding
 *
 * @param pkt packet
 * @param size new size
 */
av_shrink_packet_sync(pkt: number,size: number): void;
/**
 * Write a packet to an output media file.
 *
 * This function passes the packet directly to the muxer, without any buffering
 * or reordering. The caller is responsible for correctly interleaving the
 * packets if the format requires it. Callers that want libavformat to handle
 * the interleaving should call av_interleaved_write_frame() instead of this
 * function.
 *
 * @param s media file handle
 * @param pkt The packet containing the data to be written. Note that unlike
 *            av_interleaved_write_frame(), this function does not take
 *            ownership of the packet passed to it (though some muxers may make
 *            an internal reference to the input packet).
 *            <br>
 *            This parameter can be NULL (at any time, not just at the end), in
 *            order to immediately flush data buffered within the muxer, for
 *            muxers that buffer up data internally before writing it to the
 *            output.
 *            <br>
 *            Packet's @ref AVPacket.stream_index "stream_index" field must be
 *            set to the index of the corresponding stream in @ref
 *            AVFormatContext.streams "s->streams".
 *            <br>
 *            The timestamps (@ref AVPacket.pts "pts", @ref AVPacket.dts "dts")
 *            must be set to correct values in the stream's timebase (unless the
 *            output format is flagged with the AVFMT_NOTIMESTAMPS flag, then
 *            they can be set to AV_NOPTS_VALUE).
 *            The dts for subsequent packets passed to this function must be strictly
 *            increasing when compared in their respective timebases (unless the
 *            output format is flagged with the AVFMT_TS_NONSTRICT, then they
 *            merely have to be nondecreasing).  @ref AVPacket.duration
 *            "duration") should also be set if known.
 * @return < 0 on error, = 0 if OK, 1 if flushed and there is no more data to flush
 *
 * @see av_interleaved_write_frame()
 */
av_write_frame_sync(s: number,pkt: number): number;
/**
 * Write the stream trailer to an output media file and free the
 * file private data.
 *
 * May only be called after a successful call to avformat_write_header.
 *
 * @param s media file handle
 * @return 0 if OK, AVERROR_xxx on error
 */
av_write_trailer_sync(s: number): number;
/**
 * Copy entries from one AVDictionary struct into another.
 *
 * @note Metadata is read using the ::AV_DICT_IGNORE_SUFFIX flag
 *
 * @param dst   Pointer to a pointer to a AVDictionary struct to copy into. If *dst is NULL,
 *              this function will allocate a struct for you and put it in *dst
 * @param src   Pointer to the source AVDictionary struct to copy items from.
 * @param flags Flags to use when setting entries in *dst
 *
 * @return 0 on success, negative AVERROR code on failure. If dst was allocated
 *           by this function, callers should free the associated memory.
 */
av_dict_copy_js_sync(dst: number,src: number,flags: number): number;
/**
 * Free all the memory allocated for an AVDictionary struct
 * and all keys and values.
 */
av_dict_free_sync(m: number): void;
/**
 * Set the given entry in *pm, overwriting an existing entry.
 *
 * Note: If AV_DICT_DONT_STRDUP_KEY or AV_DICT_DONT_STRDUP_VAL is set,
 * these arguments will be freed on error.
 *
 * @warning Adding a new entry to a dictionary invalidates all existing entries
 * previously returned with av_dict_get() or av_dict_iterate().
 *
 * @param pm        Pointer to a pointer to a dictionary struct. If *pm is NULL
 *                  a dictionary struct is allocated and put in *pm.
 * @param key       Entry key to add to *pm (will either be av_strduped or added as a new key depending on flags)
 * @param value     Entry value to add to *pm (will be av_strduped or added as a new key depending on flags).
 *                  Passing a NULL value will cause an existing entry to be deleted.
 *
 * @return          >= 0 on success otherwise an error code <0
 */
av_dict_set_js_sync(pm: number,key: string,value: string,flags: number): number;
/**
 * Allocate and return an SwsContext. You need it to perform
 * scaling/conversion operations using sws_scale().
 *
 * @param srcW the width of the source image
 * @param srcH the height of the source image
 * @param srcFormat the source image format
 * @param dstW the width of the destination image
 * @param dstH the height of the destination image
 * @param dstFormat the destination image format
 * @param flags specify which algorithm and options to use for rescaling
 * @param param extra parameters to tune the used scaler
 *              For SWS_BICUBIC param[0] and [1] tune the shape of the basis
 *              function, param[0] tunes f(1) and param[1] f´(1)
 *              For SWS_GAUSS param[0] tunes the exponent and thus cutoff
 *              frequency
 *              For SWS_LANCZOS param[0] tunes the width of the window function
 * @return a pointer to an allocated context, or NULL in case of error
 * @note this function is to be removed after a saner alternative is
 *       written
 */
sws_getContext_sync(srcW: number,srcH: number,srcFormat: number,dstW: number,dstH: number,dstFormat: number,flags: number,srcFilter: number,dstFilter: number,param: number): number;
/**
 * Free the swscaler context swsContext.
 * If swsContext is NULL, then does nothing.
 */
sws_freeContext_sync(swsContext: number): void;
/**
 * Scale source data from src and write the output to dst.
 *
 * This is merely a convenience wrapper around
 * - sws_frame_start()
 * - sws_send_slice(0, src->height)
 * - sws_receive_slice(0, dst->height)
 * - sws_frame_end()
 *
 * @param c   The scaling context
 * @param dst The destination frame. See documentation for sws_frame_start() for
 *            more details.
 * @param src The source frame.
 *
 * @return 0 on success, a negative AVERROR code on failure
 */
sws_scale_frame_sync(c: number,dst: number,src: number): number;
AVPacketSideData_data_sync(a0: number,a1: number): number;
AVPacketSideData_size_sync(a0: number,a1: number): number;
AVPacketSideData_type_sync(a0: number,a1: number): number;
AVPixFmtDescriptor_comp_depth_sync(a0: number,a1: number): number;
ff_error_sync(a0: number): string;
ff_nothing_sync(): void | Promise<void>;
calloc_sync(a0: number,a1: number): number;
close_sync(a0: number): number;
dup2_sync(a0: number,a1: number): number;
free_sync(a0: number): void;
malloc_sync(a0: number): number;
mallinfo_uordblks_sync(): number;
open_sync(a0: string,a1: number,a2: number): number;
strerror_sync(a0: number): string;
libavjs_with_swscale_sync(): number;
libavjs_create_main_thread_sync(): number;
ffmpeg_main_sync(a0: number,a1: number): number | Promise<number>;
ffprobe_main_sync(a0: number,a1: number): number | Promise<number>;
AVFrame_channel_layout_sync(ptr: number): number;
AVFrame_channel_layout_s_sync(ptr: number, val: number): void;
AVFrame_channel_layouthi_sync(ptr: number): number;
AVFrame_channel_layouthi_s_sync(ptr: number, val: number): void;
AVFrame_channels_sync(ptr: number): number;
AVFrame_channels_s_sync(ptr: number, val: number): void;
AVFrame_channel_layoutmask_sync(ptr: number): number;
AVFrame_channel_layoutmask_s_sync(ptr: number, val: number): void;
AVFrame_ch_layout_nb_channels_sync(ptr: number): number;
AVFrame_ch_layout_nb_channels_s_sync(ptr: number, val: number): void;
AVFrame_crop_bottom_sync(ptr: number): number;
AVFrame_crop_bottom_s_sync(ptr: number, val: number): void;
AVFrame_crop_left_sync(ptr: number): number;
AVFrame_crop_left_s_sync(ptr: number, val: number): void;
AVFrame_crop_right_sync(ptr: number): number;
AVFrame_crop_right_s_sync(ptr: number, val: number): void;
AVFrame_crop_top_sync(ptr: number): number;
AVFrame_crop_top_s_sync(ptr: number, val: number): void;
AVFrame_data_a_sync(ptr: number, idx: number): number;
AVFrame_data_a_s_sync(ptr: number, idx: number, val: number): void;
AVFrame_format_sync(ptr: number): number;
AVFrame_format_s_sync(ptr: number, val: number): void;
AVFrame_height_sync(ptr: number): number;
AVFrame_height_s_sync(ptr: number, val: number): void;
AVFrame_key_frame_sync(ptr: number): number;
AVFrame_key_frame_s_sync(ptr: number, val: number): void;
AVFrame_linesize_a_sync(ptr: number, idx: number): number;
AVFrame_linesize_a_s_sync(ptr: number, idx: number, val: number): void;
AVFrame_nb_samples_sync(ptr: number): number;
AVFrame_nb_samples_s_sync(ptr: number, val: number): void;
AVFrame_pict_type_sync(ptr: number): number;
AVFrame_pict_type_s_sync(ptr: number, val: number): void;
AVFrame_pts_sync(ptr: number): number;
AVFrame_pts_s_sync(ptr: number, val: number): void;
AVFrame_ptshi_sync(ptr: number): number;
AVFrame_ptshi_s_sync(ptr: number, val: number): void;
AVFrame_sample_aspect_ratio_num_sync(ptr: number): number;
AVFrame_sample_aspect_ratio_num_s_sync(ptr: number, val: number): void;
AVFrame_sample_aspect_ratio_den_sync(ptr: number): number;
AVFrame_sample_aspect_ratio_den_s_sync(ptr: number, val: number): void;
AVFrame_sample_aspect_ratio_s_sync(ptr: number, num: number, den: number): void;
AVFrame_sample_rate_sync(ptr: number): number;
AVFrame_sample_rate_s_sync(ptr: number, val: number): void;
AVFrame_time_base_num_sync(ptr: number): number;
AVFrame_time_base_num_s_sync(ptr: number, val: number): void;
AVFrame_time_base_den_sync(ptr: number): number;
AVFrame_time_base_den_s_sync(ptr: number, val: number): void;
AVFrame_time_base_s_sync(ptr: number, num: number, den: number): void;
AVFrame_width_sync(ptr: number): number;
AVFrame_width_s_sync(ptr: number, val: number): void;
AVPixFmtDescriptor_flags_sync(ptr: number): number;
AVPixFmtDescriptor_flags_s_sync(ptr: number, val: number): void;
AVPixFmtDescriptor_log2_chroma_h_sync(ptr: number): number;
AVPixFmtDescriptor_log2_chroma_h_s_sync(ptr: number, val: number): void;
AVPixFmtDescriptor_log2_chroma_w_sync(ptr: number): number;
AVPixFmtDescriptor_log2_chroma_w_s_sync(ptr: number, val: number): void;
AVPixFmtDescriptor_nb_components_sync(ptr: number): number;
AVPixFmtDescriptor_nb_components_s_sync(ptr: number, val: number): void;
AVCodec_sample_fmts_sync(ptr: number): number;
AVCodec_sample_fmts_s_sync(ptr: number, val: number): void;
AVCodec_sample_fmts_a_sync(ptr: number, idx: number): number;
AVCodec_sample_fmts_a_s_sync(ptr: number, idx: number, val: number): void;
AVCodec_supported_samplerates_sync(ptr: number): number;
AVCodec_supported_samplerates_s_sync(ptr: number, val: number): void;
AVCodec_supported_samplerates_a_sync(ptr: number, idx: number): number;
AVCodec_supported_samplerates_a_s_sync(ptr: number, idx: number, val: number): void;
AVCodec_type_sync(ptr: number): number;
AVCodec_type_s_sync(ptr: number, val: number): void;
AVCodecContext_codec_id_sync(ptr: number): number;
AVCodecContext_codec_id_s_sync(ptr: number, val: number): void;
AVCodecContext_codec_type_sync(ptr: number): number;
AVCodecContext_codec_type_s_sync(ptr: number, val: number): void;
AVCodecContext_bit_rate_sync(ptr: number): number;
AVCodecContext_bit_rate_s_sync(ptr: number, val: number): void;
AVCodecContext_bit_ratehi_sync(ptr: number): number;
AVCodecContext_bit_ratehi_s_sync(ptr: number, val: number): void;
AVCodecContext_channel_layout_sync(ptr: number): number;
AVCodecContext_channel_layout_s_sync(ptr: number, val: number): void;
AVCodecContext_channel_layouthi_sync(ptr: number): number;
AVCodecContext_channel_layouthi_s_sync(ptr: number, val: number): void;
AVCodecContext_channels_sync(ptr: number): number;
AVCodecContext_channels_s_sync(ptr: number, val: number): void;
AVCodecContext_channel_layoutmask_sync(ptr: number): number;
AVCodecContext_channel_layoutmask_s_sync(ptr: number, val: number): void;
AVCodecContext_ch_layout_nb_channels_sync(ptr: number): number;
AVCodecContext_ch_layout_nb_channels_s_sync(ptr: number, val: number): void;
AVCodecContext_extradata_sync(ptr: number): number;
AVCodecContext_extradata_s_sync(ptr: number, val: number): void;
AVCodecContext_extradata_size_sync(ptr: number): number;
AVCodecContext_extradata_size_s_sync(ptr: number, val: number): void;
AVCodecContext_frame_size_sync(ptr: number): number;
AVCodecContext_frame_size_s_sync(ptr: number, val: number): void;
AVCodecContext_framerate_num_sync(ptr: number): number;
AVCodecContext_framerate_num_s_sync(ptr: number, val: number): void;
AVCodecContext_framerate_den_sync(ptr: number): number;
AVCodecContext_framerate_den_s_sync(ptr: number, val: number): void;
AVCodecContext_framerate_s_sync(ptr: number, num: number, den: number): void;
AVCodecContext_gop_size_sync(ptr: number): number;
AVCodecContext_gop_size_s_sync(ptr: number, val: number): void;
AVCodecContext_height_sync(ptr: number): number;
AVCodecContext_height_s_sync(ptr: number, val: number): void;
AVCodecContext_keyint_min_sync(ptr: number): number;
AVCodecContext_keyint_min_s_sync(ptr: number, val: number): void;
AVCodecContext_level_sync(ptr: number): number;
AVCodecContext_level_s_sync(ptr: number, val: number): void;
AVCodecContext_max_b_frames_sync(ptr: number): number;
AVCodecContext_max_b_frames_s_sync(ptr: number, val: number): void;
AVCodecContext_pix_fmt_sync(ptr: number): number;
AVCodecContext_pix_fmt_s_sync(ptr: number, val: number): void;
AVCodecContext_profile_sync(ptr: number): number;
AVCodecContext_profile_s_sync(ptr: number, val: number): void;
AVCodecContext_rc_max_rate_sync(ptr: number): number;
AVCodecContext_rc_max_rate_s_sync(ptr: number, val: number): void;
AVCodecContext_rc_max_ratehi_sync(ptr: number): number;
AVCodecContext_rc_max_ratehi_s_sync(ptr: number, val: number): void;
AVCodecContext_rc_min_rate_sync(ptr: number): number;
AVCodecContext_rc_min_rate_s_sync(ptr: number, val: number): void;
AVCodecContext_rc_min_ratehi_sync(ptr: number): number;
AVCodecContext_rc_min_ratehi_s_sync(ptr: number, val: number): void;
AVCodecContext_sample_aspect_ratio_num_sync(ptr: number): number;
AVCodecContext_sample_aspect_ratio_num_s_sync(ptr: number, val: number): void;
AVCodecContext_sample_aspect_ratio_den_sync(ptr: number): number;
AVCodecContext_sample_aspect_ratio_den_s_sync(ptr: number, val: number): void;
AVCodecContext_sample_aspect_ratio_s_sync(ptr: number, num: number, den: number): void;
AVCodecContext_sample_fmt_sync(ptr: number): number;
AVCodecContext_sample_fmt_s_sync(ptr: number, val: number): void;
AVCodecContext_sample_rate_sync(ptr: number): number;
AVCodecContext_sample_rate_s_sync(ptr: number, val: number): void;
AVCodecContext_time_base_num_sync(ptr: number): number;
AVCodecContext_time_base_num_s_sync(ptr: number, val: number): void;
AVCodecContext_time_base_den_sync(ptr: number): number;
AVCodecContext_time_base_den_s_sync(ptr: number, val: number): void;
AVCodecContext_time_base_s_sync(ptr: number, num: number, den: number): void;
AVCodecContext_qmax_sync(ptr: number): number;
AVCodecContext_qmax_s_sync(ptr: number, val: number): void;
AVCodecContext_qmin_sync(ptr: number): number;
AVCodecContext_qmin_s_sync(ptr: number, val: number): void;
AVCodecContext_width_sync(ptr: number): number;
AVCodecContext_width_s_sync(ptr: number, val: number): void;
AVCodecDescriptor_id_sync(ptr: number): number;
AVCodecDescriptor_id_s_sync(ptr: number, val: number): void;
AVCodecDescriptor_long_name_sync(ptr: number): number;
AVCodecDescriptor_long_name_s_sync(ptr: number, val: number): void;
AVCodecDescriptor_mime_types_a_sync(ptr: number, idx: number): number;
AVCodecDescriptor_mime_types_a_s_sync(ptr: number, idx: number, val: number): void;
AVCodecDescriptor_name_sync(ptr: number): number;
AVCodecDescriptor_name_s_sync(ptr: number, val: number): void;
AVCodecDescriptor_props_sync(ptr: number): number;
AVCodecDescriptor_props_s_sync(ptr: number, val: number): void;
AVCodecDescriptor_type_sync(ptr: number): number;
AVCodecDescriptor_type_s_sync(ptr: number, val: number): void;
AVCodecParameters_bit_rate_sync(ptr: number): number;
AVCodecParameters_bit_rate_s_sync(ptr: number, val: number): void;
AVCodecParameters_channel_layoutmask_sync(ptr: number): number;
AVCodecParameters_channel_layoutmask_s_sync(ptr: number, val: number): void;
AVCodecParameters_channels_sync(ptr: number): number;
AVCodecParameters_channels_s_sync(ptr: number, val: number): void;
AVCodecParameters_ch_layout_nb_channels_sync(ptr: number): number;
AVCodecParameters_ch_layout_nb_channels_s_sync(ptr: number, val: number): void;
AVCodecParameters_chroma_location_sync(ptr: number): number;
AVCodecParameters_chroma_location_s_sync(ptr: number, val: number): void;
AVCodecParameters_codec_id_sync(ptr: number): number;
AVCodecParameters_codec_id_s_sync(ptr: number, val: number): void;
AVCodecParameters_codec_tag_sync(ptr: number): number;
AVCodecParameters_codec_tag_s_sync(ptr: number, val: number): void;
AVCodecParameters_codec_type_sync(ptr: number): number;
AVCodecParameters_codec_type_s_sync(ptr: number, val: number): void;
AVCodecParameters_color_primaries_sync(ptr: number): number;
AVCodecParameters_color_primaries_s_sync(ptr: number, val: number): void;
AVCodecParameters_color_range_sync(ptr: number): number;
AVCodecParameters_color_range_s_sync(ptr: number, val: number): void;
AVCodecParameters_color_space_sync(ptr: number): number;
AVCodecParameters_color_space_s_sync(ptr: number, val: number): void;
AVCodecParameters_color_trc_sync(ptr: number): number;
AVCodecParameters_color_trc_s_sync(ptr: number, val: number): void;
AVCodecParameters_extradata_sync(ptr: number): number;
AVCodecParameters_extradata_s_sync(ptr: number, val: number): void;
AVCodecParameters_extradata_size_sync(ptr: number): number;
AVCodecParameters_extradata_size_s_sync(ptr: number, val: number): void;
AVCodecParameters_format_sync(ptr: number): number;
AVCodecParameters_format_s_sync(ptr: number, val: number): void;
AVCodecParameters_framerate_num_sync(ptr: number): number;
AVCodecParameters_framerate_num_s_sync(ptr: number, val: number): void;
AVCodecParameters_framerate_den_sync(ptr: number): number;
AVCodecParameters_framerate_den_s_sync(ptr: number, val: number): void;
AVCodecParameters_framerate_s_sync(ptr: number, num: number, den: number): void;
AVCodecParameters_height_sync(ptr: number): number;
AVCodecParameters_height_s_sync(ptr: number, val: number): void;
AVCodecParameters_level_sync(ptr: number): number;
AVCodecParameters_level_s_sync(ptr: number, val: number): void;
AVCodecParameters_profile_sync(ptr: number): number;
AVCodecParameters_profile_s_sync(ptr: number, val: number): void;
AVCodecParameters_sample_rate_sync(ptr: number): number;
AVCodecParameters_sample_rate_s_sync(ptr: number, val: number): void;
AVCodecParameters_width_sync(ptr: number): number;
AVCodecParameters_width_s_sync(ptr: number, val: number): void;
AVPacket_data_sync(ptr: number): number;
AVPacket_data_s_sync(ptr: number, val: number): void;
AVPacket_dts_sync(ptr: number): number;
AVPacket_dts_s_sync(ptr: number, val: number): void;
AVPacket_dtshi_sync(ptr: number): number;
AVPacket_dtshi_s_sync(ptr: number, val: number): void;
AVPacket_duration_sync(ptr: number): number;
AVPacket_duration_s_sync(ptr: number, val: number): void;
AVPacket_durationhi_sync(ptr: number): number;
AVPacket_durationhi_s_sync(ptr: number, val: number): void;
AVPacket_flags_sync(ptr: number): number;
AVPacket_flags_s_sync(ptr: number, val: number): void;
AVPacket_pos_sync(ptr: number): number;
AVPacket_pos_s_sync(ptr: number, val: number): void;
AVPacket_poshi_sync(ptr: number): number;
AVPacket_poshi_s_sync(ptr: number, val: number): void;
AVPacket_pts_sync(ptr: number): number;
AVPacket_pts_s_sync(ptr: number, val: number): void;
AVPacket_ptshi_sync(ptr: number): number;
AVPacket_ptshi_s_sync(ptr: number, val: number): void;
AVPacket_side_data_sync(ptr: number): number;
AVPacket_side_data_s_sync(ptr: number, val: number): void;
AVPacket_side_data_elems_sync(ptr: number): number;
AVPacket_side_data_elems_s_sync(ptr: number, val: number): void;
AVPacket_size_sync(ptr: number): number;
AVPacket_size_s_sync(ptr: number, val: number): void;
AVPacket_stream_index_sync(ptr: number): number;
AVPacket_stream_index_s_sync(ptr: number, val: number): void;
AVPacket_time_base_num_sync(ptr: number): number;
AVPacket_time_base_num_s_sync(ptr: number, val: number): void;
AVPacket_time_base_den_sync(ptr: number): number;
AVPacket_time_base_den_s_sync(ptr: number, val: number): void;
AVPacket_time_base_s_sync(ptr: number, num: number, den: number): void;
AVFormatContext_flags_sync(ptr: number): number;
AVFormatContext_flags_s_sync(ptr: number, val: number): void;
AVFormatContext_nb_streams_sync(ptr: number): number;
AVFormatContext_nb_streams_s_sync(ptr: number, val: number): void;
AVFormatContext_oformat_sync(ptr: number): number;
AVFormatContext_oformat_s_sync(ptr: number, val: number): void;
AVFormatContext_pb_sync(ptr: number): number;
AVFormatContext_pb_s_sync(ptr: number, val: number): void;
AVFormatContext_streams_a_sync(ptr: number, idx: number): number;
AVFormatContext_streams_a_s_sync(ptr: number, idx: number, val: number): void;
AVStream_codecpar_sync(ptr: number): number;
AVStream_codecpar_s_sync(ptr: number, val: number): void;
AVStream_discard_sync(ptr: number): number;
AVStream_discard_s_sync(ptr: number, val: number): void;
AVStream_duration_sync(ptr: number): number;
AVStream_duration_s_sync(ptr: number, val: number): void;
AVStream_durationhi_sync(ptr: number): number;
AVStream_durationhi_s_sync(ptr: number, val: number): void;
AVStream_time_base_num_sync(ptr: number): number;
AVStream_time_base_num_s_sync(ptr: number, val: number): void;
AVStream_time_base_den_sync(ptr: number): number;
AVStream_time_base_den_s_sync(ptr: number, val: number): void;
AVStream_time_base_s_sync(ptr: number, num: number, den: number): void;
AVFilterInOut_filter_ctx_sync(ptr: number): number;
AVFilterInOut_filter_ctx_s_sync(ptr: number, val: number): void;
AVFilterInOut_name_sync(ptr: number): number;
AVFilterInOut_name_s_sync(ptr: number, val: number): void;
AVFilterInOut_next_sync(ptr: number): number;
AVFilterInOut_next_s_sync(ptr: number, val: number): void;
AVFilterInOut_pad_idx_sync(ptr: number): number;
AVFilterInOut_pad_idx_s_sync(ptr: number, val: number): void;
av_frame_free_js_sync(ptr: number): void;
av_packet_free_js_sync(ptr: number): void;
avformat_close_input_js_sync(ptr: number): void;
avcodec_free_context_js_sync(ptr: number): void;
avcodec_parameters_free_js_sync(ptr: number): void;
avfilter_graph_free_js_sync(ptr: number): void;
avfilter_inout_free_js_sync(ptr: number): void;
av_dict_free_js_sync(ptr: number): void;
copyin_u8_sync(ptr: number, arr: Uint8Array): void;
copyout_u8_sync(ptr: number, len: number): Uint8Array;
copyin_s16_sync(ptr: number, arr: Int16Array): void;
copyout_s16_sync(ptr: number, len: number): Int16Array;
copyin_s32_sync(ptr: number, arr: Int32Array): void;
copyout_s32_sync(ptr: number, len: number): Int32Array;
copyin_f32_sync(ptr: number, arr: Float32Array): void;
copyout_f32_sync(ptr: number, len: number): Float32Array;

/**
 * Read a complete file from the in-memory filesystem.
 * @param name  Filename to read
 */
readFile_sync(name: string): Uint8Array;
/**
 * Write a complete file to the in-memory filesystem.
 * @param name  Filename to write
 * @param content  Content to write to the file
 */
writeFile_sync(name: string, content: Uint8Array): Uint8Array;
/**
 * Delete a file in the in-memory filesystem.
 * @param name  Filename to delete
 */
unlink_sync(name: string): void;
/**
 * Unmount a mounted filesystem.
 * @param mountpoint  Path where the filesystem is mounted
 */
unmount_sync(mountpoint: string): void;
/**
 * Make a lazy file. Direct link to createLazyFile.
 */
createLazyFile_sync(
    parent: string, name: string, url: string, canRead: boolean,
    canWrite: boolean
): void;
/**
 * Make a reader device.
 * @param name  Filename to create.
 * @param mode  Unix permissions (pointless since this is an in-memory
 *              filesystem)
 */
mkreaderdev_sync(name: string, mode?: number): void;
/**
 * Make a block reader "device". Technically a file that we then hijack to have
 * our behavior.
 * @param name  Filename to create.
 * @param size  Size of the device to present.
 */
mkblockreaderdev_sync(name: string, size: number): void;
/**
 * Make a readahead device. This reads a File (or other Blob) and attempts to
 * read ahead of whatever libav actually asked for. Note that this overrides
 * onblockread, so if you want to support both kinds of files, make sure you set
 * onblockread before calling this.
 * @param name  Filename to create.
 * @param file  Blob or file to read.
 */
mkreadaheadfile_sync(name: string, file: Blob): void;
/**
 * Make a writer device.
 * @param name  Filename to create
 * @param mode  Unix permissions
 */
mkwriterdev_sync(name: string, mode?: number): void;
/**
 * Make a stream writer device. The same as a writer device but does not allow
 * seeking.
 * @param name  Filename to create
 * @param mode  Unix permissions
 */
mkstreamwriterdev_sync(name: string, mode?: number): void;
/**
 * Mount a writer *filesystem*. All files created in this filesystem will be
 * redirected as writers. The directory will be created for you if it doesn't
 * already exist, but it may already exist.
 * @param mountpoint  Directory to mount as a writer filesystem
 */
mountwriterfs_sync(mountpoint: string): void;
/**
 * Make a workerfs file. Returns the filename that it's mounted to.
 * @param name  Filename to use.
 * @param blob  Blob to load at that file.
 */
mkworkerfsfile_sync(name: string, blob: Blob): string;
/**
 * Unmount (unmake) a workerfs file. Give the *original name you provided*, not
 * the name mkworkerfsfile returned.
 * @param name  Filename to unmount.
 */
unlinkworkerfsfile_sync(name: string): void;
/**
 * Send some data to a reader device. To indicate EOF, send null. To indicate an
 * error, send EOF and include an error code in the options.
 * @param name  Filename of the reader device.
 * @param data  Data to send.
 * @param opts  Optional send options, such as an error code.
 */
ff_reader_dev_send_sync(
    name: string, data: Uint8Array | null,
    opts?: {
        errorCode?: number,
        error?: any // any other error, used internally
    }
): void;
/**
 * Send some data to a block reader device. To indicate EOF, send null (but note
 * that block read devices have a fixed size, and will automatically send EOF
 * for reads outside of that size, so you should not normally need to send EOF).
 * To indicate an error, send EOF and include an error code in the options.
 * @param name  Filename of the reader device.
 * @param pos  Position of the data in the file.
 * @param data  Data to send.
 * @param opts  Optional send options, such as an error code.
 */
ff_block_reader_dev_send_sync(
    name: string, pos: number, data: Uint8Array | null,
    opts?: {
        errorCode?: number,
        error?: any // any other error, used internally
    }
): void;
/**
 * Metafunction to determine whether any device has any waiters. This can be
 * used to determine whether more data needs to be sent before a previous step
 * will be fully resolved.
 * @param name  Optional name of file to check for waiters
 */
ff_reader_dev_waiting_sync(name?: string): boolean;
/**
 * Metafunction to initialize an encoder with all the bells and whistles.
 * Returns [AVCodec, AVCodecContext, AVFrame, AVPacket, frame_size]
 * @param name  libav name of the codec
 * @param opts  Encoder options
 */
ff_init_encoder_sync(
    name: string, opts?: {
        ctx?: AVCodecContextProps,
        time_base?: [number, number],
        options?: Record<string, string>
    }
): [number, number, number, number, number];
/**
 * Metafunction to initialize a decoder with all the bells and whistles.
 * Similar to ff_init_encoder but doesn't need to initialize the frame.
 * Returns [AVCodec, AVCodecContext, AVPacket, AVFrame]
 * @param name  libav decoder identifier or name
 * @param codecpar  Optional AVCodecParameters
 */
ff_init_decoder_sync(
    name: string | number, codecpar?: number
): [number, number, number, number];
/**
 * Free everything allocated by ff_init_encoder.
 * @param c  AVCodecContext
 * @param frame  AVFrame
 * @param pkt  AVPacket
 */
ff_free_encoder_sync(
    c: number, frame: number, pkt: number
): void;
/**
 * Free everything allocated by ff_init_decoder
 * @param c  AVCodecContext
 * @param pkt  AVPacket
 * @param frame  AVFrame
 */
ff_free_decoder_sync(
    c: number, pkt: number, frame: number
): void;
/**
 * Encode some number of frames at once. Done in one go to avoid excess message
 * passing.
 * @param ctx  AVCodecContext
 * @param frame  AVFrame
 * @param pkt  AVPacket
 * @param inFrames  Array of frames in libav.js format
 * @param fin  Set to true if this is the end of encoding
 */
ff_encode_multi_sync(
    ctx: number, frame: number, pkt: number, inFrames: (Frame | number)[],
    fin?: boolean
): Packet[];
/**
 * Decode some number of packets at once. Done in one go to avoid excess
 * message passing.
 * @param ctx  AVCodecContext
 * @param pkt  AVPacket
 * @param frame  AVFrame
 * @param inPackets  Incoming packets to decode
 * @param config  Decoding options. May be "true" to indicate end of stream.
 */
ff_decode_multi_sync(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Frame[]
ff_decode_multi_sync(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ptr"
    }
): number[]
ff_decode_multi_sync(
    ctx: number, pkt: number, frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ImageData"
    }
): ImageData[];
/**
 * Initialize a muxer format, format context and some number of streams.
 * Returns [AVFormatContext, AVOutputFormat, AVIOContext, AVStream[]]
 * @param opts  Muxer options
 * @param stramCtxs  Context info for each stream to mux
 */
ff_init_muxer_sync(
    opts: {
        oformat?: number, // format pointer
        format_name?: string, // libav name
        filename?: string,
        device?: boolean, // Create a writer device
        open?: boolean, // Open the file for writing
        codecpars?: boolean // Streams is in terms of codecpars, not codecctx
    },
    streamCtxs: [number, number, number][] // AVCodecContext | AVCodecParameters, time_base_num, time_base_den
): [number, number, number, number[]];
/**
 * Free up a muxer format and/or file
 * @param oc  AVFormatContext
 * @param pb  AVIOContext
 */
ff_free_muxer_sync(oc: number, pb: number): void;
/**
 * Initialize a demuxer from a file and format context, and get the list of
 * codecs/types.
 * Returns [AVFormatContext, Stream[]]
 * @param filename  Filename to open
 * @param fmt  Format to use (optional)
 */
ff_init_demuxer_file_sync(
    filename: string, fmt?: string
): [number, Stream[]] | Promise<[number, Stream[]]>;
/**
 * Write some number of packets at once.
 * @param oc  AVFormatContext
 * @param pkt  AVPacket
 * @param inPackets  Packets to write
 * @param interleave  Set to false to *not* use the interleaved writer.
 *                    Interleaving is the default.
 */
ff_write_multi_sync(
    oc: number, pkt: number, inPackets: (Packet | number)[], interleave?: boolean
): void;
/**
 * Read many packets at once. If you don't set any limits, this function will
 * block (asynchronously) until the whole file is read, so make sure you set
 * some limits if you want to read a bit at a time. Returns a pair [result,
 * packets], where the result indicates whether an error was encountered, an
 * EOF, or simply limits (EAGAIN), and packets is a dictionary indexed by the
 * stream number in which each element is an array of packets from that stream.
 * @param fmt_ctx  AVFormatContext
 * @param pkt  AVPacket
 * @param opts  Other options
 */
ff_read_frame_multi_sync(
    fmt_ctx: number, pkt: number, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket?: "default" // Version of ff_copyout_packet to use
    }
): [number, Record<number, Packet[]>] | Promise<[number, Record<number, Packet[]>]>
ff_read_frame_multi_sync(
    fmt_ctx: number, pkt: number, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket: "ptr" // Version of ff_copyout_packet to use
    }
): [number, Record<number, number[]>] | Promise<[number, Record<number, number[]>]>;
/**
 * @deprecated
 * DEPRECATED. Use `ff_read_frame_multi`.
 * Read many packets at once. This older API is now deprecated. The devfile
 * parameter is unused and unsupported. Dev files should be used via the normal
 * `ff_reader_dev_waiting` API, rather than counting on device file limits, as
 * this function used to.
 * @param fmt_ctx  AVFormatContext
 * @param pkt  AVPacket
 * @param devfile  Unused
 * @param opts  Other options
 */
ff_read_multi_sync(
    fmt_ctx: number, pkt: number, devfile?: string, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket?: "default" // Version of ff_copyout_packet to use
    }
): [number, Record<number, Packet[]>] | Promise<[number, Record<number, Packet[]>]>
ff_read_multi_sync(
    fmt_ctx: number, pkt: number, devfile?: string, opts?: {
        limit?: number, // OUTPUT limit, in bytes
        devLimit?: number, // INPUT limit, in bytes (don't read if less than this much data is available)
        unify?: boolean, // If true, unify the packets into a single stream (called 0), so that the output is in the same order as the input
        copyoutPacket: "ptr" // Version of ff_copyout_packet to use
    }
): [number, Record<number, number[]>] | Promise<[number, Record<number, number[]>]>;
/**
 * Initialize a filter graph. No equivalent free since you just need to free
 * the graph itself (av_filter_graph_free) and everything under it will be
 * freed automatically.
 * Returns [AVFilterGraph, AVFilterContext, AVFilterContext], where the second
 * and third are the input and output buffer source/sink. For multiple
 * inputs/outputs, the second and third will be arrays, as appropriate.
 * @param filters_descr  Filtergraph description
 * @param input  Input settings, or array of input settings for multiple inputs
 * @param output  Output settings, or array of output settings for multiple
 *                outputs
 */
ff_init_filter_graph_sync(
    filters_descr: string,
    input: FilterIOSettings,
    output: FilterIOSettings
): [number, number, number];
ff_init_filter_graph_sync(
    filters_descr: string,
    input: FilterIOSettings[],
    output: FilterIOSettings
): [number, number[], number];
ff_init_filter_graph_sync(
    filters_descr: string,
    input: FilterIOSettings,
    output: FilterIOSettings[]
): [number, number, number[]];
ff_init_filter_graph_sync(
    filters_descr: string,
    input: FilterIOSettings[],
    output: FilterIOSettings[]
): [number, number[], number[]];
/**
 * Filter some number of frames, possibly corresponding to multiple sources.
 * @param srcs  AVFilterContext(s), input
 * @param buffersink_ctx  AVFilterContext, output
 * @param framePtr  AVFrame
 * @param inFrames  Input frames, either as an array of frames or with frames
 *                  per input
 * @param config  Options. May be "true" to indicate end of stream.
 */
ff_filter_multi_sync(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Frame[];
ff_filter_multi_sync(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }[]
): Frame[]
ff_filter_multi_sync(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame: "ptr"
    }
): number[];
ff_filter_multi_sync(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame: "ptr"
    }[]
): number[]
ff_filter_multi_sync(
    srcs: number, buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[], config?: boolean | {
        fin?: boolean,
        copyoutFrame: "ImageData"
    }
): ImageData[];
ff_filter_multi_sync(
    srcs: number[], buffersink_ctx: number, framePtr: number,
    inFrames: (Frame | number)[][], config?: boolean[] | {
        fin?: boolean,
        copyoutFrame: "ImageData"
    }[]
): ImageData[];
/**
 * Decode and filter frames. Just a combination of ff_decode_multi and
 * ff_filter_multi that's all done on the libav.js side.
 * @param ctx  AVCodecContext
 * @param buffersrc_ctx  AVFilterContext, input
 * @param buffersink_ctx  AVFilterContext, output
 * @param pkt  AVPacket
 * @param frame  AVFrame
 * @param inPackets  Incoming packets to decode and filter
 * @param config  Decoding and filtering options. May be "true" to indicate end
 *                of stream.
 */
ff_decode_filter_multi_sync(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame?: "default" | "video" | "video_packed"
    }
): Frame[]
ff_decode_filter_multi_sync(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ptr"
    }
): number[]
ff_decode_filter_multi_sync(
    ctx: number, buffersrc_ctx: number, buffersink_ctx: number, pkt: number,
    frame: number, inPackets: (Packet | number)[],
    config?: boolean | {
        fin?: boolean,
        ignoreErrors?: boolean,
        copyoutFrame: "ImageData"
    }
): ImageData[];
/**
 * Copy out a frame.
 * @param frame  AVFrame
 */
ff_copyout_frame_sync(frame: number): Frame;
/**
 * Copy out a video frame. `ff_copyout_frame` will copy out a video frame if a
 * video frame is found, but this may be faster if you know it's a video frame.
 * @param frame  AVFrame
 */
ff_copyout_frame_video_sync(frame: number): Frame;
/**
 * Get the size of a packed video frame in its native format.
 * @param frame  AVFrame
 */
ff_frame_video_packed_size_sync(frame: number): Frame;
/**
 * Copy out a video frame, as a single packed Uint8Array.
 * @param frame  AVFrame
 */
ff_copyout_frame_video_packed_sync(frame: number): Frame;
/**
 * Copy out a video frame as an ImageData. The video frame *must* be RGBA for
 * this to work as expected (though some ImageData will be returned for any
 * frame).
 * @param frame  AVFrame
 */
ff_copyout_frame_video_imagedata_sync(
    frame: number
): ImageData;
/**
 * Copy in a frame.
 * @param framePtr  AVFrame
 * @param frame  Frame to copy in, as either a Frame or an AVFrame pointer
 */
ff_copyin_frame_sync(framePtr: number, frame: Frame | number): void;
/**
 * Copy out a packet.
 * @param pkt  AVPacket
 */
ff_copyout_packet_sync(pkt: number): Packet;
/**
 * Copy "out" a packet by just copying its data into a new AVPacket.
 * @param pkt  AVPacket
 */
ff_copyout_packet_ptr_sync(pkt: number): number;
/**
 * Copy in a packet.
 * @param pktPtr  AVPacket
 * @param packet  Packet to copy in, as either a Packet or an AVPacket pointer
 */
ff_copyin_packet_sync(pktPtr: number, packet: Packet | number): void;
/**
 * Allocate and copy in a 32-bit int list.
 * @param list  List of numbers to copy in
 */
ff_malloc_int32_list_sync(list: number[]): number;
/**
 * Allocate and copy in a 64-bit int list.
 * @param list  List of numbers to copy in
 */
ff_malloc_int64_list_sync(list: number[]): number;
/**
 * Allocate and copy in a string array. The resulting array will be
 * NULL-terminated.
 * @param arr  Array of strings to copy in.
 */
ff_malloc_string_array_sync(arr: string[]): number;
/**
 * Free a string array allocated by ff_malloc_string_array.
 * @param ptr  Pointer to the array to free.
 */
ff_free_string_array_sync(ptr: number): void;
/**
 * Frontend to the ffmpeg CLI (if it's compiled in). Pass arguments as strings,
 * or you may intermix arrays of strings for multiple arguments.
 *
 * NOTE: ffmpeg 6.0 and later require threads for the ffmpeg CLI. libav.js
 * *does* support the ffmpeg CLI on unthreaded environments, but to do so, it
 * uses an earlier version of the CLI, from 5.1.3. The libraries are still
 * modern, and if running libav.js in threaded mode, the ffmpeg CLI is modern as
 * well. As time passes, these two versions will drift apart, so make sure you
 * know whether you're running in threaded mode or not!
 */
ffmpeg_sync(...args: (string | string[])[]): number | Promise<number>;
/**
 * Frontend to the ffprobe CLI (if it's compiled in). Pass arguments as strings,
 * or you may intermix arrays of strings for multiple arguments.
 */
ffprobe_sync(...args: (string | string[])[]): number | Promise<number>;

}

/**
 * Options to create a libav.js instance.
 */
export interface LibAVOpts {
    /**
     * Don't create a worker.
     */
    noworker?: boolean;

    /**
     * Don't use WebAssembly.
     */
    nowasm?: boolean;

    /**
     * Use threads. If threads ever become reliable, this flag will disappear,
     * and you will need to use nothreads.
     */
    yesthreads?: boolean;

    /**
     * Don't use threads. The default.
     */
    nothreads?: boolean;

    /**
     * Don't use ES6 modules for loading, even if libav.js was compiled as an
     * ES6 module.
     */
    noes6?: boolean;

    /**
     * URL base from which to load workers and modules.
     */
    base?: string;

    /**
     * URL from which to load the module factory.
     */
    toImport?: string;

    /**
     * The module factory to use itself.
     */
    factory?: any;

    /**
     * The variant to load (instead of whichever variant was compiled)
     */
    variant?: string;

    /**
     * The full URL from which to load the .wasm file.
     */
    wasmurl?: string;
}

/**
 * The main wrapper for libav.js, typically named "LibAV".
 */
export interface LibAVWrapper extends LibAVOpts, LibAVStatic {
    /**
     * Create a LibAV instance.
     * @param opts  Options
     */
    LibAV(opts?: LibAVOpts & {noworker?: false}): Promise<LibAV>;
    LibAV(opts: LibAVOpts & {noworker: true}): Promise<LibAV & LibAVSync>;
    LibAV(opts: LibAVOpts): Promise<LibAV | LibAV & LibAVSync>;
}

/**
 * If using ES6, the main export.
 */
declare const LibAV: LibAVWrapper;
export default LibAV;
