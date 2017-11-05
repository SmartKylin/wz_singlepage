var webgl = function () {
    function e(e) {
        this.name = e,
            this.program = null,
            this.attribs = {},
            this.uniforms = {}
    }

    function t(e, t, r) {
        var n = gl.createShader(e);
        if (gl.shaderSource(n, t),
                gl.compileShader(n),
                gl.getShaderParameter(n, gl.COMPILE_STATUS))
            return n;
        gl.getShaderInfoLog(n);
        throw console.log("Shader: " + r),
            console.log("Type: " + (e == gl.VERTEX_SHADER ? "vertex" : "fragment")),
            forEachLine(t, function (e, t) {
                var r = ("  " + (t + 1)).slice(-3);
                console.log(r + ": " + e)
            }),
        {
            type: "COMPILE",
            shaderType: e == gl.VERTEX_SHADER ? "vertex" : "fragment",
            name: r,
            shader: n,
            source: gl.getShaderSource(n),
            log: gl.getShaderInfoLog(n)
        }
    }

    function r(e) {
        var r = "precision highp float;\n"
            , n = gl.createProgram();
        if (gl.attachShader(n, t(gl.VERTEX_SHADER, e.vertexSource, e.name)),
                gl.attachShader(n, t(gl.FRAGMENT_SHADER, r + e.fragmentSource, e.name)),
                gl.linkProgram(n),
                gl.getProgramParameter(n, gl.LINK_STATUS))
            return n;
        throw {
            type: "LINK",
            name: e.name,
            program: n,
            log: gl.getProgramInfoLog(n)
        }
    }

    function n(e) {
        function t(e) {
            var t = /^\/\/\s*(\w+(?:.(vertex|fragment))?)\s*\/\//
                , r = [];
            forEachLine(e, function (e) {
                var n = t.exec(e);
                if (n) {
                    var o = n[1];
                    i[o] = r = []
                } else
                    r.push(e)
            })
        }

        i = {},
            _.each(e, function (e) {
                return _.isObject(e) ? void _.extend(i, e) : void $.ajax({
                    url: e,
                    async: !1,
                    cache: !1,
                    success: t
                })
            }),
            _.each(i, function (e, t) {
                _.isArray(e) && (i[t] = e.join("\n"))
            })
    }

    function o(e, t, r, n) {
        switch (this.width = e,
            this.height = t,
            this.framebuffer = gl.createFramebuffer(),
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer),
            this.texture = gl.createTexture(),
            gl.bindTexture(gl.TEXTURE_2D, this.texture),
            this.dataType = n ? gl.FLOAT : gl.UNSIGNED_BYTE,
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, e, t, 0, gl.RGBA, this.dataType, null),
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR),
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0),
            this.depthTexture = null,
            this.depthRenderbuffer = null,
            r = r ? "TEXTURE" : "NONE",
            r = "RENDERBUFFER") {
            case "TEXTURE":
                this.depthTexture = gl.createTexture(),
                    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, e, t, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null),
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
                break;
            case "RENDERBUFFER":
                this.depthRenderbuffer = gl.createRenderbuffer(),
                    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer),
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, e, t),
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRenderbuffer),
                    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    var a = {
        enabledMask: 0,
        maxEnabledIndex: -1,
        disableAll: function () {
            for (var e = 0; e <= this.maxEnabledIndex; ++e) {
                var t = 1 << e;
                t & this.enabledMask && gl.disableVertexAttribArray(e)
            }
            this.enabledMask = 0,
                this.maxEnabledIndex = -1
        },
        enable: function (e) {
            var t = 1 << e;
            t & this.enabledMask || (gl.enableVertexAttribArray(e),
                this.enabledMask |= t,
                this.maxEnabledIndex = Math.max(this.maxEnabledIndex, e))
        },
        disable: function (e) {
            var t = 1 << e;
            t & this.enabledMask && (gl.disableVertexAttribArray(e),
                this.enabledMask &= ~t)
        }
    };
    e.prototype.setProgram = function (e) {
        function t(e) {
            if (e.type == gl.SAMPLER_2D || e.type == gl.SAMPLER_CUBE) {
                var t = a;
                return a += e.size,
                    t
            }
            return -1
        }

        this.program = e;
        for (var r = gl.getProgramParameter(e, gl.ACTIVE_ATTRIBUTES), n = 0; r > n; ++n) {
            var o = gl.getActiveAttrib(e, n);
            this.attribs[o.name] = {
                index: gl.getAttribLocation(e, o.name),
                name: o.name,
                size: o.size,
                type: o.type
            }
        }
        for (var a = 0, i = gl.getProgramParameter(e, gl.ACTIVE_UNIFORMS), n = 0; i > n; ++n) {
            var u = gl.getActiveUniform(e, n);
            this.uniforms[u.name] = {
                location: gl.getUniformLocation(e, u.name),
                name: u.name,
                size: u.size,
                type: u.type,
                texUnit: t(u)
            }
        }
    }
        ,
        e.prototype.use = function () {
            return gl.useProgram(this.program),
                a.disableAll(),
                this
        }
        ,
        e.prototype.getUniformLocation = function (e) {
            var t = this.uniforms[e];
            return t ? t.location : null
        }
        ,
        e.prototype.getAttribIndex = function (e) {
            var t = this.attribs[e];
            return t ? t.index : -1
        }
        ,
        e.prototype.uniform1i = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform1i(r, t)
        }
        ,
        e.prototype.uniform1f = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform1f(r, t)
        }
        ,
        e.prototype.uniform2f = function (e, t, r) {
            var n = this.getUniformLocation(e);
            n && gl.uniform2f(n, t, r)
        }
        ,
        e.prototype.uniform3f = function (e, t, r, n) {
            var o = this.getUniformLocation(e);
            o && gl.uniform3f(o, t, r, n)
        }
        ,
        e.prototype.uniform4f = function (e, t, r, n, o) {
            var a = this.getUniformLocation(e);
            a && gl.uniform4f(a, t, r, n, o)
        }
        ,
        e.prototype.uniform1fv = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform1fv(r, t)
        }
        ,
        e.prototype.uniform2fv = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform2fv(r, t)
        }
        ,
        e.prototype.uniform3fv = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform3fv(r, t)
        }
        ,
        e.prototype.uniform4fv = function (e, t) {
            var r = this.getUniformLocation(e);
            r && gl.uniform4fv(r, t)
        }
        ,
        e.prototype.uniformMatrix3fv = function (e, t, r) {
            var n = this.getUniformLocation(e);
            n && (r = r || !1,
                gl.uniformMatrix3fv(n, r, t))
        }
        ,
        e.prototype.uniformMatrix4fv = function (e, t, r) {
            var n = this.getUniformLocation(e);
            n && (r = r || !1,
                gl.uniformMatrix4fv(n, r, t))
        }
        ,
        e.prototype.uniformSampler = function (e, t, r) {
            var n = this.uniforms[e];
            n && (gl.activeTexture(gl.TEXTURE0 + n.texUnit),
                gl.bindTexture(t, r),
                gl.uniform1i(n.location, n.texUnit))
        }
        ,
        e.prototype.uniformSampler2D = function (e, t) {
            this.uniformSampler(e, gl.TEXTURE_2D, t)
        }
        ,
        e.prototype.uniformSamplerCube = function (e, t) {
            this.uniformSampler(e, gl.TEXTURE_CUBE_MAP, t)
        }
        ,
        e.prototype.enableVertexAttribArray = function (e) {
            var t = this.attribs[e];
            t && a.enable(t.index)
        }
        ,
        e.prototype.disableVertexAttribArray = function (e) {
            var t = this.attribs[e];
            t && a.disable(t.index)
        }
        ,
        e.prototype.vertexAttribPointer = function (e, t, r, n, o, i) {
            var u = this.attribs[e];
            u && (a.enable(u.index),
                gl.vertexAttribPointer(u.index, t, r, n, o, i))
        }
    ;
    var i = {}
        , u = function () {
        function t(e) {
            var t = !!i[e];
            return console.assert(t, e + " not found."),
                t
        }

        function n(n, o) {
            if (t(n) && t(n + ".vertex") && t(n + ".fragment")) {
                o = o || {};
                var a = "";
                o.defines && _.each(o.defines, function (e, t) {
                    a += "#define " + t + " " + e + "\n"
                });
                var u = a + (i[n] || "")
                    , c = _.reject(u.split("\n"), function (e) {
                    return e.match(/attribute/)
                }).join("\n");
                try {
                    var l = new e(n);
                    return l.setProgram(r({
                        name: n,
                        vertexSource: u + i[n + ".vertex"],
                        fragmentSource: c + i[n + ".fragment"]
                    })),
                        l
                } catch (s) {
                    return onGLSLError(s),
                        null
                }
            }
        }

        function o(e, t) {
            var r = [];
            return t && t.defines && _.each(t.defines, function (e, t) {
                r.push(t + "=" + e)
            }),
            e + " " + r.join(" ")
        }

        return _.memoize(n, o)
    }();
    return o.prototype.render = function (e) {
        var t = gl.getParameter(gl.VIEWPORT);
        gl.viewport(0, 0, this.width, this.height),
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer),
            e(),
            gl.bindFramebuffer(gl.FRAMEBUFFER, null),
            gl.viewport(t[0], t[1], t[2], t[3])
    }
        ,
        o.prototype.resize = function (e, t) {
            this.width = e,
                this.height = t,
                gl.bindTexture(gl.TEXTURE_2D, this.texture),
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, e, t, 0, gl.RGBA, this.dataType, null),
            this.depthTexture && (gl.bindTexture(gl.TEXTURE_2D, this.depthTexture),
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, e, t, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null)),
            this.depthRenderbuffer && (gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer),
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, e, t),
                gl.bindRenderbuffer(gl.RENDERBUFFER, null))
        }
        ,
    {
        makeBuffer: function (e, t, r) {
            r = r || gl.STATIC_DRAW;
            var n = gl.createBuffer();
            return gl.bindBuffer(e, n),
                gl.bufferData(e, t, r),
                n
        },
        makeVertexBuffer: function (e, t) {
            return this.makeBuffer(gl.ARRAY_BUFFER, e, t)
        },
        makeElementBuffer: function (e, t) {
            return this.makeBuffer(gl.ELEMENT_ARRAY_BUFFER, e, t)
        },
        bindVertexBuffer: function (e) {
            gl.bindBuffer(gl.ARRAY_BUFFER, e)
        },
        bindElementBuffer: function (e) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e)
        },
        setupCanvas: function (e, t) {
            function r(r) {
                try {
                    return e.getContext(r, t)
                } catch (n) {
                    return null
                }
            }

            t = t || {},
                t = _.defaults(t, {
                    antialias: !1,
                    preserveDrawingBuffer: !0,
                    extensions: [],
                    shaderSources: ["shaders/all-shaders.glsl"]
                });
            var o = r("webgl") || r("experimental-webgl");
            if (o) {
                var a = this.extensions = {};
                _.each(t.extensions, function (e) {
                    a[e] = o.getExtension(e)
                });
                window.gl = o;
                n(t.shaderSources);
            }
            return o
        },
        getProgram: u,
        createTexture2D: function (e) {
            var t = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, t),
                e = e || {},
                e.width = e.width || e.size || 4,
                e.height = e.height || e.width,
                e.format = e.format || gl.RGBA,
                e.type = e.type || gl.UNSIGNED_BYTE,
                e.mag = e.mag || e.filter || gl.NEAREST,
                e.min = e.min || e.mag,
                e.wrapS = e.wrapS || e.wrap || gl.CLAMP_TO_EDGE,
                e.wrapT = e.wrapT || e.wrapS,
                e.dataFormat = e.dataFormat || e.format,
                e.data = e.data || null;
            var r = 0
                , n = 0;
            if (gl.texImage2D(gl.TEXTURE_2D, r, e.format, e.width, e.height, n, e.dataFormat, e.type, e.data),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, e.min),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, e.mag),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, e.wrapS),
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, e.wrapT),
                    e.aniso) {
                var o = webgl.extensions.WEBKIT_EXT_texture_filter_anisotropic;
                o && gl.texParameteri(gl.TEXTURE_2D, o.TEXTURE_MAX_ANISOTROPY_EXT, e.aniso)
            }
            return t
        },
        loadTexture2D: function (e, t) {
            t = t || {},
                t = _.defaults(t, {
                    mipmap: !1,
                    flip: !1,
                    callback: null,
                    filter: gl.LINEAR
                });
            var r = this.createTexture2D(t)
                , n = new Image;
            return n.src = e,
                n.onload = function () {
                    gl.bindTexture(gl.TEXTURE_2D, r),
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, t.flip ? 1 : 0),
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, n),
                    t.mipmap && (gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR),
                        gl.generateMipmap(gl.TEXTURE_2D)),
                    t.callback && t.callback(r)
                }
                ,
                r
        },
        RenderTexture: o
    }
}();