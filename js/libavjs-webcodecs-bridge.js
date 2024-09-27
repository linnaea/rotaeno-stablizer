(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LibAVWebCodecsBridge = {}));
})(this, (function (exports) { 'use strict';

    /*
     * This file is part of the libav.js WebCodecs Bridge implementation.
     *
     * Copyright (c) 2023, 2024 Yahweasel
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
     * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
     * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
     * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     */
    var __awaiter$2 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Convert a libav.js audio stream to a WebCodecs configuration.
     *
     * @param libav  The libav.js instance that created this stream.
     * @param stream  The stream to convert.
     */
    function audioStreamToConfig$1(libav, stream) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const codecString = yield libav.avcodec_get_name(stream.codec_id);
            // Start with the basics
            const ret = {
                codec: null,
                sampleRate: yield libav.AVCodecParameters_sample_rate(stream.codecpar),
                numberOfChannels: yield libav.AVCodecParameters_channels(stream.codecpar)
            };
            // Get the extradata
            const extradataPtr = yield libav.AVCodecParameters_extradata(stream.codecpar);
            let extradata = null;
            if (extradataPtr) {
                const edSize = yield libav.AVCodecParameters_extradata_size(stream.codecpar);
                extradata = yield libav.copyout_u8(extradataPtr, edSize);
            }
            // Then convert the actual codec
            switch (codecString) {
                case "flac":
                    ret.codec = "flac";
                    ret.description = extradata;
                    break;
                case "mp3":
                    ret.codec = "mp3";
                    break;
                case "aac":
                    {
                        const profile = yield libav.AVCodecParameters_profile(stream.codecpar);
                        switch (profile) {
                            case 1: // AAC_LOW
                                ret.codec = "mp4a.40.2";
                                break;
                            case 4: // AAC_HE
                                ret.codec = "mp4a.40.5";
                                break;
                            case 28: // AAC_HE_V2
                                ret.codec = "mp4a.40.29";
                                break;
                        }
                        if (extradata)
                            ret.description = extradata;
                        break;
                    }
                case "opus":
                    ret.codec = "opus";
                    break;
                case "vorbis":
                    ret.codec = "vorbis";
                    ret.description = extradata;
                    break;
                default:
                    // Best we can do is a libavjs-webcodecs-polyfill-specific config
                    if (typeof LibAVWebCodecs !== "undefined") {
                        ret.codec = { libavjs: {
                                codec: codecString,
                                ctx: {
                                    channels: yield libav.AVCodecParameters_channels(stream.codecpar),
                                    sample_rate: yield libav.AVCodecParameters_sample_rate(stream.codecpar)
                                }
                            } };
                        if (extradata)
                            ret.description = extradata;
                    }
                    break;
            }
            if (ret.codec)
                return ret;
            return null;
        });
    }
    /**
     * Convert a libav.js video stream to a WebCodecs configuration.
     *
     * @param libav  The libav.js instance that created this stream.
     * @param stream  The stream to convert.
     */
    function videoStreamToConfig$1(libav, stream) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const codecString = yield libav.avcodec_get_name(stream.codec_id);
            // Start with the basics
            const ret = {
                codec: null,
                codedWidth: yield libav.AVCodecParameters_width(stream.codecpar),
                codedHeight: yield libav.AVCodecParameters_height(stream.codecpar)
            };
            // Get the extradata
            const extradataPtr = yield libav.AVCodecParameters_extradata(stream.codecpar);
            let extradata = null;
            if (extradataPtr) {
                const edSize = yield libav.AVCodecParameters_extradata_size(stream.codecpar);
                extradata = yield libav.copyout_u8(extradataPtr, edSize);
            }
            // Some commonly needed data
            let profile = yield libav.AVCodecParameters_profile(stream.codecpar);
            let level = yield libav.AVCodecParameters_level(stream.codecpar);
            // Then convert the actual codec
            switch (codecString) {
                case "av1":
                    {
                        let codec = "av01";
                        // <profile>
                        codec += `.0${profile}`;
                        // <level><tier>
                        let levelS = level.toString();
                        if (levelS.length < 2)
                            levelS = `0${level}`;
                        const tier = "M"; // FIXME: Is this exposed by ffmpeg?
                        codec += `.${levelS}${tier}`;
                        // <bitDepth>
                        const format = yield libav.AVCodecParameters_format(stream.codecpar);
                        const desc = yield libav.av_pix_fmt_desc_get(format);
                        let bitDepth = (yield libav.AVPixFmtDescriptor_comp_depth(desc, 0)).toString();
                        if (bitDepth.length < 2)
                            bitDepth = `0${bitDepth}`;
                        codec += `.${bitDepth}`;
                        // <monochrome>
                        const nbComponents = yield libav.AVPixFmtDescriptor_nb_components(desc);
                        if (nbComponents < 2)
                            codec += ".1";
                        else
                            codec += ".0";
                        // .<chromaSubsampling>
                        let subX = 0, subY = 0, subP = 0;
                        if (nbComponents < 2) {
                            // Monochrome is always considered subsampled (weirdly)
                            subX = 1;
                            subY = 1;
                        }
                        else {
                            subX = yield libav.AVPixFmtDescriptor_log2_chroma_w(desc);
                            subY = yield libav.AVPixFmtDescriptor_log2_chroma_h(desc);
                            /* FIXME: subP (subsampling position) mainly represents the
                             * *vertical* position, which doesn't seem to be exposed by
                             * ffmpeg, at least not in a usable way */
                        }
                        codec += `.${subX}${subY}${subP}`;
                        // FIXME: the rest are technically optional, so left out
                        ret.codec = codec;
                        break;
                    }
                case "h264": // avc1
                    {
                        let codec = "avc1";
                        // Technique extracted from hlsenc.c
                        if (extradata &&
                            (extradata[0] | extradata[1] | extradata[2]) === 0 &&
                            extradata[3] === 1 &&
                            (extradata[4] & 0x1F) === 7) {
                            codec += ".";
                            for (let i = 5; i <= 7; i++) {
                                let s = extradata[i].toString(16);
                                if (s.length < 2)
                                    s = "0" + s;
                                codec += s;
                            }
                        }
                        else {
                            // Do it from the stream data alone
                            // <profile>
                            if (profile < 0)
                                profile = 77;
                            const profileB = profile & 0xFF;
                            let profileS = profileB.toString(16);
                            if (profileS.length < 2)
                                profileS = `0${profileS}`;
                            codec += `.${profileS}`;
                            // <a nonsensical byte with some constraints and some reserved 0s>
                            let constraints = 0;
                            if (profile & 0x100 /* FF_PROFILE_H264_CONSTRAINED */) {
                                // One or more of the constraint bits should be set
                                if (profileB === 66 /* FF_PROFILE_H264_BASELINE */) {
                                    // All three
                                    constraints |= 0xE0;
                                }
                                else if (profileB === 77 /* FF_PROFILE_H264_MAIN */) {
                                    // Only constrained to main
                                    constraints |= 0x60;
                                }
                                else if (profile === 88 /* FF_PROFILE_H264_EXTENDED */) {
                                    // Only constrained to extended
                                    constraints |= 0x20;
                                }
                                else {
                                    // Constrained, but we don't understand how
                                    break;
                                }
                            }
                            let constraintsS = constraints.toString(16);
                            if (constraintsS.length < 2)
                                constraintsS = `0${constraintsS}`;
                            codec += constraintsS;
                            // <level>
                            if (level < 0)
                                level = 10;
                            let levelS = level.toString(16);
                            if (levelS.length < 2)
                                levelS = `0${levelS}`;
                            codec += levelS;
                        }
                        ret.codec = codec;
                        if (extradata && extradata[0])
                            ret.description = extradata;
                        break;
                    }
                case "hevc": // hev1/hvc1
                    {
                        let codec;
                        if (extradata && extradata.length > 12) {
                            codec = "hvc1";
                            const dv = new DataView(extradata.buffer);
                            ret.description = extradata;
                            // Extrapolated from MP4Box.js
                            codec += ".";
                            const profileSpace = extradata[1] >> 6;
                            switch (profileSpace) {
                                case 1:
                                    codec += "A";
                                    break;
                                case 2:
                                    codec += "B";
                                    break;
                                case 3:
                                    codec += "C";
                                    break;
                            }
                            const profileIDC = extradata[1] & 0x1F;
                            codec += profileIDC + ".";
                            const profileCompatibility = dv.getUint32(2);
                            let val = profileCompatibility;
                            let reversed = 0;
                            for (let i = 0; i < 32; i++) {
                                reversed |= val & 1;
                                if (i === 31)
                                    break;
                                reversed <<= 1;
                                val >>= 1;
                            }
                            codec += reversed.toString(16) + ".";
                            const tierFlag = (extradata[1] & 0x20) >> 5;
                            if (tierFlag === 0)
                                codec += 'L';
                            else
                                codec += 'H';
                            const levelIDC = extradata[12];
                            codec += levelIDC;
                            let constraintString = "";
                            for (let i = 11; i >= 6; i--) {
                                const b = extradata[i];
                                if (b || constraintString)
                                    constraintString = "." + b.toString(16) + constraintString;
                            }
                            codec += constraintString;
                        }
                        else {
                            /* NOTE: This string was extrapolated from hlsenc.c, but is clearly
                             * not valid for every possible H.265 stream. */
                            codec = `hev1.${profile}.4.L${level}.B01`;
                        }
                        ret.codec = codec;
                        break;
                    }
                case "vp8":
                    ret.codec = "vp8";
                    break;
                case "vp9":
                    {
                        let codec = "vp09";
                        // <profile>
                        let profileS = profile.toString();
                        if (profile < 0)
                            profileS = "00";
                        if (profileS.length < 2)
                            profileS = `0${profileS}`;
                        codec += `.${profileS}`;
                        // <level>
                        let levelS = level.toString();
                        if (level < 0)
                            levelS = "10";
                        if (levelS.length < 2)
                            levelS = `0${levelS}`;
                        codec += `.${levelS}`;
                        // <bitDepth>
                        const format = yield libav.AVCodecParameters_format(stream.codecpar);
                        const desc = yield libav.av_pix_fmt_desc_get(format);
                        let bitDepth = (yield libav.AVPixFmtDescriptor_comp_depth(desc, 0)).toString();
                        if (bitDepth === "0")
                            bitDepth = "08";
                        if (bitDepth.length < 2)
                            bitDepth = `0${bitDepth}`;
                        codec += `.${bitDepth}`;
                        // <chromaSubsampling>
                        const subX = yield libav.AVPixFmtDescriptor_log2_chroma_w(desc);
                        const subY = yield libav.AVPixFmtDescriptor_log2_chroma_h(desc);
                        let chromaSubsampling = 0;
                        if (subX > 0 && subY > 0) {
                            chromaSubsampling = 1; // YUV420
                        }
                        else if (subX > 0 || subY > 0) {
                            chromaSubsampling = 2; // YUV422
                        }
                        else {
                            chromaSubsampling = 3; // YUV444
                        }
                        codec += `.0${chromaSubsampling}`;
                        codec += ".1.1.1.0";
                        ret.codec = codec;
                        break;
                    }
                default:
                    // Best we can do is a libavjs-webcodecs-polyfill-specific config
                    if (typeof LibAVWebCodecs !== "undefined") {
                        ret.codec = { libavjs: {
                                codec: codecString,
                                ctx: {
                                    channels: yield libav.AVCodecParameters_channels(stream.codecpar),
                                    sample_rate: yield libav.AVCodecParameters_sample_rate(stream.codecpar)
                                }
                            } };
                        if (extradata)
                            ret.description = extradata;
                    }
                    break;
            }
            if (ret.codec)
                return ret;
            return null;
        });
    }
    /*
     * Convert the timestamp and duration from a libav.js packet to microseconds for
     * WebCodecs.
     */
    function times$1(packet, stream) {
        // Convert from lo, hi to f64
        let pDuration = packet.durationhi * 0x100000000 + packet.duration;
        let pts = packet.ptshi * 0x100000000 + packet.pts;
        if (typeof LibAV !== "undefined" && LibAV.i64tof64) {
            pDuration = LibAV.i64tof64(packet.duration, packet.durationhi);
            pts = LibAV.i64tof64(packet.pts, packet.ptshi);
        }
        // Get the appropriate time base
        let tbNum = packet.time_base_num;
        let tbDen = packet.time_base_den;
        if (!tbNum) {
            tbNum = stream.time_base_num;
            tbDen = stream.time_base_den;
        }
        // Convert the duration
        const duration = Math.round(pDuration * tbNum / tbDen * 1000000);
        // Convert the timestamp
        let timestamp = Math.round(pts * tbNum / tbDen * 1000000);
        return { timestamp, duration };
    }
    /**
     * Convert a libav.js audio packet to a WebCodecs EncodedAudioChunk.
     * @param packet  The packet itself.
     * @param stream  The stream this packet belongs to (necessary for timestamp conversion).
     * @param opts  Extra options. In particular, if using a polyfill, you can set
     *              the EncodedAudioChunk constructor here.
     */
    function packetToEncodedAudioChunk$1(packet, stream, opts = {}) {
        let EAC;
        if (opts.EncodedAudioChunk)
            EAC = opts.EncodedAudioChunk;
        else
            EAC = EncodedAudioChunk;
        const { timestamp, duration } = times$1(packet, stream);
        return new EAC({
            type: "key", // all audio chunks are keyframes in all audio codecs
            timestamp,
            duration,
            data: packet.data.buffer
        });
    }
    /**
     * Convert a libav.js video packet to a WebCodecs EncodedVideoChunk.
     * @param packet  The packet itself.
     * @param stream  The stream this packet belongs to (necessary for timestamp conversion).
     * @param opts  Extra options. In particular, if using a polyfill, you can set
     *              the EncodedVideoChunk constructor here.
     */
    function packetToEncodedVideoChunk$1(packet, stream, opts = {}) {
        let EVC;
        if (opts.EncodedVideoChunk)
            EVC = opts.EncodedVideoChunk;
        else
            EVC = EncodedVideoChunk;
        const { timestamp, duration } = times$1(packet, stream);
        return new EVC({
            type: (packet.flags & 1) ? "key" : "delta",
            timestamp,
            duration,
            data: packet.data.buffer
        });
    }

    /*
     * This file is part of the libav.js WebCodecs Bridge implementation.
     *
     * Copyright (c) 2023, 2024 Yahweasel
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
     * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
     * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
     * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     */
    var __awaiter$1 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Convert a WebCodecs audio configuration to stream context sufficient for
     * libav.js, namely codecpar and timebase.
     *
     * @param libav  The libav.js instance that created this stream.
     * @param config  The configuration to convert.
     * @returns [address of codecpar, timebase numerator, timebase denominator]
     */
    function configToAudioStream$1(libav, config) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const codecLong = config.codec;
            let codec;
            if (typeof codecLong === "object")
                codec = codecLong.libavjs.codec;
            else
                codec = codecLong.replace(/\..*/, "");
            // Convert the codec to a libav name
            switch (codec) {
                case "mp4a":
                    codec = "aac";
                    break;
                case "pcm-u8":
                    codec = "pcm_u8";
                    break;
                case "pcm-s16":
                    codec = "pcm_s16le";
                    break;
                case "pcm-s24":
                    codec = "pcm_s24le";
                    break;
                case "pcm-s32":
                    codec = "pcm_s32le";
                    break;
                case "pcm-f32":
                    codec = "pcm_f32le";
                    break;
            }
            // Find the associated codec
            const desc = yield libav.avcodec_descriptor_get_by_name(codec);
            // Make the codecpar
            const codecpar = yield libav.avcodec_parameters_alloc();
            if (desc) {
                yield libav.AVCodecParameters_codec_type_s(codecpar, yield libav.AVCodecDescriptor_type(desc));
                yield libav.AVCodecParameters_codec_id_s(codecpar, yield libav.AVCodecDescriptor_id(desc));
                if (config.sampleRate) {
                    yield libav.AVCodecParameters_sample_rate_s(codecpar, config.sampleRate);
                }
                if (config.numberOfChannels) {
                    yield libav.AVCodecParameters_channels_s(codecpar, config.numberOfChannels);
                }
            }
            // And the timebase
            let timebaseNum = 1, timebaseDen = 1000000;
            if (config.sampleRate)
                timebaseDen = config.sampleRate;
            return [codecpar, timebaseNum, timebaseDen];
        });
    }
    /**
     * Convert a WebCodecs video configuration to stream context sufficient for
     * libav.js, namely codecpar and timebase.
     *
     * @param libav  The libav.js instance that created this stream.
     * @param config  The configuration to convert.
     * @returns [address of codecpar, timebase numerator, timebase denominator]
     */
    function configToVideoStream$1(libav, config) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const codecLong = config.codec;
            let codec;
            let codecParts = [];
            if (typeof codecLong === "object")
                codec = codecLong.libavjs.codec;
            else {
                codec = codecLong.replace(/\..*/, "");
                codecParts = codecLong.split('.');
            }
            // Convert the codec to a libav name
            switch (codec) {
                case "av01":
                    codec = "av1";
                    break;
                case "avc1":
                case "avc3":
                    codec = "h264";
                    break;
                case "hev1":
                case "hvc1":
                    codec = "hevc";
                    break;
                case "vp09":
                    codec = "vp9";
                    break;
            }
            // Find the associated codec
            const desc = yield libav.avcodec_descriptor_get_by_name(codec);
            // Make the codecpar
            const codecpar = yield libav.avcodec_parameters_alloc();
            if (desc) {
                yield libav.AVCodecParameters_codec_type_s(codecpar, yield libav.AVCodecDescriptor_type(desc));
                yield libav.AVCodecParameters_codec_id_s(codecpar, yield libav.AVCodecDescriptor_id(desc));
                yield libav.AVCodecParameters_format_s(codecpar, 0);
                yield libav.AVCodecParameters_color_range_s(codecpar, 0);
                yield libav.AVCodecParameters_chroma_location_s(codecpar, 0);
                yield libav.AVCodecParameters_width_s(codecpar, config.width);
                yield libav.AVCodecParameters_height_s(codecpar, config.height);
                switch (codec) {
                    case "av1": {
                        if(codecParts.length > 1) yield libav.AVCodecParameters_profile_s(codecpar, parseInt(codecParts[1]));
                        if(codecParts.length > 2) yield libav.AVCodecParameters_level_s(codecpar, parseInt(codecParts[2]));
                        if(codecParts.length > 5) switch(codecParts[5]) {
                            case '112': yield libav.AVCodecParameters_chroma_location_s(codecpar, 3); break;
                            case '111': yield libav.AVCodecParameters_chroma_location_s(codecpar, 1); break;
                            case '100': yield libav.AVCodecParameters_format_s(codecpar, 4); break; // AV_PIX_FMT_YUV422P
                            case '000': yield libav.AVCodecParameters_format_s(codecpar, 5); break; // AV_PIX_FMT_YUV444P
                        }
                        if(codecParts.length > 6) yield libav.AVCodecParameters_color_primaries_s(codecpar, parseInt(codecParts[6]));
                        if(codecParts.length > 7) yield libav.AVCodecParameters_color_trc_s(codecpar, parseInt(codecParts[7]));
                        if(codecParts.length > 8) yield libav.AVCodecParameters_color_space_s(codecpar, parseInt(codecParts[8]));
                        if(codecParts.length > 9) if (codecParts[9] === '1') {
                            yield libav.AVCodecParameters_color_range_s(codecpar, 2);
                        }
                        break;
                    }
                    case "h264": if(codecParts.length === 2 && codecParts[1].length === 6) {
                        yield libav.AVCodecParameters_profile_s(codecpar, parseInt(codecParts[1].slice(0,2), 16));
                        yield libav.AVCodecParameters_level_s(codecpar, parseInt(codecParts[1].slice(4,6), 16));
                    }
                        break;
                    case "hevc": {
                        if(codecParts.length > 1) yield libav.AVCodecParameters_profile_s(codecpar, parseInt(codecParts[1]));
                        if(codecParts.length > 3) yield libav.AVCodecParameters_level_s(codecpar, parseInt(codecParts[3].slice(1)));
                        break;
                    }
                    case "vp9": {
                        if(codecParts.length > 1) yield libav.AVCodecParameters_profile_s(codecpar, parseInt(codecParts[1]));
                        if(codecParts.length > 2) yield libav.AVCodecParameters_level_s(codecpar, parseInt(codecParts[2]));
                        if(codecParts.length > 4) switch(codecParts[4]) {
                            case '01': yield libav.AVCodecParameters_chroma_location_s(codecpar, 3); break;
                            case '00': yield libav.AVCodecParameters_chroma_location_s(codecpar, 2); break;
                            case '02': yield libav.AVCodecParameters_format_s(codecpar, 4); break; // AV_PIX_FMT_YUV422P
                            case '03': yield libav.AVCodecParameters_format_s(codecpar, 5); break; // AV_PIX_FMT_YUV444P
                        }
                        if(codecParts.length > 5) yield libav.AVCodecParameters_color_primaries_s(codecpar, parseInt(codecParts[5]));
                        if(codecParts.length > 6) yield libav.AVCodecParameters_color_trc_s(codecpar, parseInt(codecParts[6]));
                        if(codecParts.length > 7) yield libav.AVCodecParameters_color_space_s(codecpar, parseInt(codecParts[7]));
                        if(codecParts.length > 8) if (codecParts[8] === '01') {
                            yield libav.AVCodecParameters_color_range_s(codecpar, 2);
                        }
                        break;
                    }
                }
                // FIXME: Use displayWidth and displayHeight to make SAR
            }
            // And the timebase
            let timebaseNum = 1, timebaseDen = 1000000;
            if (config.framerate) {
                // Simple if it's an integer
                if (config.framerate === ~~config.framerate) {
                    timebaseDen = config.framerate;
                }
                else {
                    /* Need to find an integer ratio. First try 1001, as many common
                     * framerates are x/1001 */
                    const fr1001 = config.framerate * 1001;
                    if (fr1001 === ~~fr1001) {
                        timebaseNum = 1001;
                        timebaseDen = fr1001;
                    }
                    else {
                        /* Just look for a power of two. This will always work because
                         * of how floating point works. */
                        timebaseDen = config.framerate;
                        while (timebaseDen !== Math.floor(timebaseDen)) {
                            timebaseNum *= 2;
                            timebaseDen *= 2;
                        }
                    }
                }
            }
            return [codecpar, timebaseNum, timebaseDen];
        });
    }
    /*
     * Convert the timestamp and duration from microseconds to an arbitrary timebase
     * given by libav.js (internal)
     */
    function times(chunk, stream) {
        const num = stream[1];
        const den = stream[2];
        return {
            timestamp: Math.round(chunk.timestamp * den / num / 1000000),
            duration: Math.round(chunk.duration * den / num / 1000000)
        };
    }
    /*
     * Convert a WebCodecs Encoded{Audio,Video}Chunk to a libav.js packet for muxing. Internal.
     */
    function encodedChunkToPacket(chunk, stream, streamIndex) {
        const { timestamp, duration } = times(chunk, stream);
        // Convert into high and low bits
        let pts, ptshi, dur, durhi;
        if (typeof LibAV !== "undefined" && LibAV.f64toi64) {
            [pts, ptshi] = LibAV.f64toi64(timestamp);
            [dur, durhi] = LibAV.f64toi64(duration);
        }
        else {
            pts = ~~timestamp;
            ptshi = Math.floor(timestamp / 0x100000000);
            dur = ~~duration;
            durhi = Math.floor(duration / 0x100000000);
        }
        // Create a buffer for it
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data.buffer);
        // And make a packet
        return {
            data,
            pts, ptshi,
            dts: pts, dtshi: ptshi,
            time_base_num: stream[1], time_base_den: stream[2],
            stream_index: streamIndex,
            flags: 0,
            duration: dur, durationhi: durhi
        };
    }
    /**
     * Convert a WebCodecs EncodedAudioChunk to a libav.js packet for muxing.
     * @param libav  The libav.js instance that created this stream.
     * @param chunk  The chunk itself.
     * @param metadata  The metadata sent with this chunk.
     * @param stream  The stream this packet belongs to (necessary for timestamp conversion).
     * @param streamIndex  The stream index to inject into the packet
     */
    function encodedAudioChunkToPacket$1(libav, chunk, metadata, stream, streamIndex) {
        return __awaiter$1(this, void 0, void 0, function* () {
            // NOTE: libav and metadata are not currently used for audio
            return encodedChunkToPacket(chunk, stream, streamIndex);
        });
    }
    /**
     * Convert a WebCodecs EncodedVideoChunk to a libav.js packet for muxing. Note
     * that this also may modify codecpar, if the packet comes with extradata.
     * @param libav  The libav.js instance that created this stream.
     * @param chunk  The chunk itself.
     * @param metadata  The metadata sent with this chunk.
     * @param stream  The stream this packet belongs to (necessary for timestamp conversion).
     * @param streamIndex  The stream index to inject into the packet
     */
    function encodedVideoChunkToPacket$1(libav, chunk, metadata, stream, streamIndex) {
        return __awaiter$1(this, void 0, void 0, function* () {
            const ret = encodedChunkToPacket(chunk, stream, streamIndex);
            if (chunk.type === "key")
                ret.flags = 1;
            // Copy in the extradata if applicable
            if (stream[0] && metadata && metadata.decoderConfig && metadata.decoderConfig.description) {
                const codecpar = stream[0];
                const oldExtradata = yield libav.AVCodecParameters_extradata(codecpar);
                if (!oldExtradata) {
                    let description = metadata.decoderConfig.description;
                    if (description.buffer)
                        description = description.slice(0);
                    else
                        description = (new Uint8Array(description)).slice(0);
                    const extradata = yield libav.malloc(description.length);
                    yield libav.copyin_u8(extradata, description);
                    yield libav.AVCodecParameters_extradata_s(codecpar, extradata);
                    yield libav.AVCodecParameters_extradata_size_s(codecpar, description.length);
                }
            }
            return ret;
        });
    }

    /*
     * This file is part of the libav.js WebCodecs Bridge implementation.
     *
     * Copyright (c) 2024 Yahweasel and contributors
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
     * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
     * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
     * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     */
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Convert a VideoFrame to a libav.js Frame. The libav.js frame will use the
     * same timebase as WebCodecs, 1/1000000.
     * @param frame  VideoFrame to convert.
     */
    function videoFrameToLAFrame$1(frame) {
        return __awaiter(this, void 0, void 0, function* () {
            // First just naively extract all the data
            const data = new Uint8Array(frame.allocationSize());
            yield frame.copyTo(data);
            /* libav.js ≥ 5 changed the format of frames, harmonizing it with the format
             * of WebCodecs. This bridge is still compatible with libav.js < 5, but
             * assumes ≥ 5 unless it can prove otherwise. */
            let libavjs5 = true;
            if (typeof LibAV !== "undefined" && LibAV && LibAV.VER &&
                parseInt(LibAV.VER) < 5) {
                libavjs5 = false;
            }
            // Then figure out how that corresponds to planes
            let libavFormat = 5, bpp = 1, planes = 3, cwlog2 = 0, chlog2 = 0;
            switch (frame.format) {
                case "I420":
                    libavFormat = 0;
                    cwlog2 = chlog2 = 1;
                    break;
                case "I420A":
                    libavFormat = 33;
                    planes = 4;
                    cwlog2 = chlog2 = 1;
                    break;
                case "I422":
                    libavFormat = 4;
                    cwlog2 = 1;
                    break;
                case "NV12":
                    libavFormat = 23;
                    planes = 2;
                    chlog2 = 1;
                    break;
                case "RGBA":
                case "RGBX":
                    libavFormat = 26;
                    planes = 1;
                    bpp = 4;
                    break;
                case "BGRA":
                case "BGRX":
                    libavFormat = 28;
                    planes = 1;
                    bpp = 4;
                    break;
            }
            // And copy out the data
            const laFrame = {
                format: libavFormat,
                data: null,
                pts: ~~frame.timestamp,
                ptshi: Math.floor(frame.timestamp / 0x100000000),
                time_base_num: 1,
                time_base_den: 1000000,
                width: frame.visibleRect.width,
                height: frame.visibleRect.height
            };
            if (libavjs5) {
                // Make our layout
                const layout = [];
                let offset = 0;
                for (let p = 0; p < planes; p++) {
                    let w = frame.visibleRect.width;
                    let h = frame.visibleRect.height;
                    if (p === 1 || p === 2) {
                        w >>= cwlog2;
                        h >>= chlog2;
                    }
                    layout.push({ offset, stride: w * bpp });
                    offset += w * h * bpp;
                }
                laFrame.data = data;
                laFrame.layout = layout;
            }
            else {
                // libav.js < 5 format: one array per row
                laFrame.data = [];
                let offset = 0;
                for (let p = 0; p < planes; p++) {
                    const plane = [];
                    laFrame.data.push(plane);
                    let wlog2 = 0, hlog2 = 0;
                    if (p === 1 || p === 2) {
                        wlog2 = cwlog2;
                        hlog2 = chlog2;
                    }
                    for (let y = 0; y < frame.visibleRect.height >>> hlog2; y++) {
                        const w = (frame.visibleRect.width * bpp) >>> wlog2;
                        plane.push(data.subarray(offset, offset + w));
                        offset += w;
                    }
                }
            }
            return laFrame;
        });
    }
    /**
     * Convert an AudioData to a libav.js Frame. The libav.js frame will use the
     * same timebase as WebCodecs, 1/1000000.
     * @param frame  AudioFrame to convert.
     */
    function audioDataToLAFrame$1(frame) {
        return __awaiter(this, void 0, void 0, function* () {
            // Figure out how the data corresponds to frames
            let libavFormat = 6;
            let TypedArray = Int16Array;
            const planar = /-planar$/.test(frame.format);
            switch (frame.format) {
                case "u8":
                case "u8-planar":
                    libavFormat = planar ? 5 : 0;
                    TypedArray = Uint8Array;
                    break;
                case "s16":
                case "s16-planar":
                    libavFormat = planar ? 6 : 1;
                    break;
                case "s32":
                case "s32-planar":
                    libavFormat = planar ? 7 : 2;
                    TypedArray = Int32Array;
                    break;
                case "f32":
                case "f32-planar":
                    libavFormat = planar ? 8 : 3;
                    TypedArray = Float32Array;
                    break;
            }
            // And copy out the data
            const laFrame = {
                format: libavFormat,
                data: null,
                pts: ~~frame.timestamp,
                ptshi: Math.floor(frame.timestamp / 0x100000000),
                time_base_num: 1,
                time_base_den: 1000000,
                sample_rate: frame.sampleRate,
                nb_samples: frame.numberOfFrames,
                channels: frame.numberOfChannels
            };
            if (planar) {
                laFrame.data = [];
                for (let p = 0; p < frame.numberOfChannels; p++) {
                    const plane = new TypedArray(frame.numberOfFrames);
                    laFrame.data.push(plane);
                    yield frame.copyTo(plane.buffer, { planeIndex: p, format: frame.format });
                }
            }
            else {
                const data = laFrame.data = new TypedArray(frame.numberOfFrames * frame.numberOfChannels);
                yield frame.copyTo(data.buffer, { planeIndex: 0, format: frame.format });
            }
            return laFrame;
        });
    }

    /*
     * This file is part of the libav.js WebCodecs Bridge implementation.
     *
     * Copyright (c) 2024 Yahweasel and contributors
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
     * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
     * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
     * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     */
    // (Duplicated from libav.js)
    function i64tof64(lo, hi) {
        // Common positive case
        if (!hi && lo >= 0)
            return lo;
        // Common negative case
        if (hi === -1 && lo < 0)
            return lo;
        /* Lo bit negative numbers are really just the 32nd bit being
         * set, so we make up for that with an additional 2^32 */
        return (hi * 0x100000000 +
            lo +
            ((lo < 0) ? 0x100000000 : 0));
    }
    /**
     * Convert a libav.js timestamp to a WebCodecs timestamp.
     * @param lo  Low bits of the timestamp.
     * @param hi  High bits of the timestamp.
     * @param timeBase  Optional timebase to use for conversion.
     */
    function laTimeToWCTime(lo, hi, timeBase) {
        let ret = i64tof64(lo, hi);
        if (timeBase)
            ret = Math.round(ret * 1000000 * timeBase[0] / timeBase[1]);
        return ret;
    }
    /**
     * Convert a libav.js Frame to a VideoFrame. If not provided in opts, the
     * libav.js frame is assumed to use the same timebase as WebCodecs, 1/1000000.
     * @param frame  libav.js Frame.
     * @param opts  Optional options, namely a VideoFrame constructor and timebase
     *              to use.
     */
    function laFrameToVideoFrame$1(frame, opts = {}) {
        let VF;
        if (opts.VideoFrame)
            VF = opts.VideoFrame;
        else
            VF = VideoFrame;
        let layout;
        let data;
        let transfer = [];
        let timeBase = opts.timeBase;
        if (!timeBase && frame.time_base_num)
            timeBase = [frame.time_base_num, frame.time_base_den];
        if (frame.layout) {
            // Modern (libav.js ≥ 5) frame in WebCodecs-like format
            data = frame.data;
            layout = frame.layout;
            if (opts.transfer)
                transfer.push(data.buffer);
        }
        else {
            // Pre-libavjs-5 frame with one array per row
            // Combine all the frame data into a single object
            const layout = [];
            let size = 0;
            for (let p = 0; p < frame.data.length; p++) {
                const plane = frame.data[p];
                layout.push({
                    offset: size,
                    stride: plane[0].length
                });
                size += plane.length * plane[0].length;
            }
            const data = new Uint8Array(size);
            let offset = 0;
            for (let p = 0; p < frame.data.length; p++) {
                const plane = frame.data[p];
                const linesize = plane[0].length;
                for (let y = 0; y < plane.length; y++) {
                    data.set(plane[y], offset);
                    offset += linesize;
                }
            }
            transfer.push(data.buffer);
        }
        // Choose the format
        let format = "I420";
        switch (frame.format) {
            case 0:
                format = "I420";
                break;
            case 33:
                format = "I420A";
                break;
            case 4:
                format = "I422";
                break;
            case 23:
                format = "NV12";
                break;
            case 26:
                format = "RGBA";
                break;
            case 28:
                format = "BGRA";
                break;
            default:
                throw new Error("Unsupported pixel format");
        }
        // And make the VideoFrame
        return new VF(data, {
            format,
            codedWidth: frame.width,
            codedHeight: frame.height,
            timestamp: laTimeToWCTime(frame.pts, frame.ptshi, timeBase),
            layout,
            transfer
        });
    }
    /**
     * Convert a libav.js Frame to an AudioData. If not provide din opts, the
     * libav.js frame is assumed to use the same timebase as WebCodecs, 1/1000000.
     * @param frame  libav.js Frame.
     * @param opts  Optional options, namely an AudioData constructor and timebase
     *              to use.
     */
    function laFrameToAudioData$1(frame, opts = {}) {
        let AD;
        if (opts.AudioData)
            AD = opts.AudioData;
        else
            AD = AudioData;
        let timeBase = opts.timeBase;
        if (!timeBase && frame.time_base_num)
            timeBase = [frame.time_base_num, frame.time_base_den];
        // Combine all the frame data into a single object
        let size = 0;
        if (frame.data.buffer) {
            // Non-planar
            size = frame.data.byteLength;
        }
        else {
            // Planar
            for (let p = 0; p < frame.data.length; p++)
                size += frame.data[p].byteLength;
        }
        const data = new Uint8Array(size);
        if (frame.data.buffer) {
            const rd = frame.data;
            data.set(new Uint8Array(rd.buffer, rd.byteOffset, rd.byteLength));
        }
        else {
            let offset = 0;
            for (let p = 0; p < frame.data.length; p++) {
                const rp = frame.data[p];
                const plane = new Uint8Array(rp.buffer, rp.byteOffset, rp.byteLength);
                data.set(plane, offset);
                offset += plane.length;
            }
        }
        // Choose the format
        let format = "s16";
        switch (frame.format) {
            case 0:
                format = "u8";
                break;
            case 1:
                format = "s16";
                break;
            case 2:
                format = "s32";
                break;
            case 3:
                format = "f32";
                break;
            case 5:
                format = "u8-planar";
                break;
            case 6:
                format = "s16-planar";
                break;
            case 7:
                format = "s32-planar";
                break;
            case 8:
                format = "f32-planar";
                break;
            default:
                throw new Error("Unsupported sample format");
        }
        // And make the AudioData
        return new AD({
            format,
            data,
            sampleRate: frame.sample_rate,
            numberOfFrames: frame.nb_samples,
            numberOfChannels: frame.channels,
            timestamp: laTimeToWCTime(frame.pts, frame.ptshi, timeBase)
        });
    }

    /*
     * This file is part of the libav.js WebCodecs Bridge implementation.
     *
     * Copyright (c) 2023 Yahweasel
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
     * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
     * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
     * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     */
    /*
     * This is the main entry point and simply exposes the interfaces provided by
     * other components.
     */
    const audioStreamToConfig = audioStreamToConfig$1;
    const videoStreamToConfig = videoStreamToConfig$1;
    const packetToEncodedAudioChunk = packetToEncodedAudioChunk$1;
    const packetToEncodedVideoChunk = packetToEncodedVideoChunk$1;
    const configToAudioStream = configToAudioStream$1;
    const configToVideoStream = configToVideoStream$1;
    const encodedAudioChunkToPacket = encodedAudioChunkToPacket$1;
    const encodedVideoChunkToPacket = encodedVideoChunkToPacket$1;
    const videoFrameToLAFrame = videoFrameToLAFrame$1;
    const audioDataToLAFrame = audioDataToLAFrame$1;
    const laFrameToVideoFrame = laFrameToVideoFrame$1;
    const laFrameToAudioData = laFrameToAudioData$1;

    exports.audioDataToLAFrame = audioDataToLAFrame;
    exports.audioStreamToConfig = audioStreamToConfig;
    exports.configToAudioStream = configToAudioStream;
    exports.configToVideoStream = configToVideoStream;
    exports.encodedAudioChunkToPacket = encodedAudioChunkToPacket;
    exports.encodedVideoChunkToPacket = encodedVideoChunkToPacket;
    exports.laFrameToAudioData = laFrameToAudioData;
    exports.laFrameToVideoFrame = laFrameToVideoFrame;
    exports.packetToEncodedAudioChunk = packetToEncodedAudioChunk;
    exports.packetToEncodedVideoChunk = packetToEncodedVideoChunk;
    exports.videoFrameToLAFrame = videoFrameToLAFrame;
    exports.videoStreamToConfig = videoStreamToConfig;

}));
