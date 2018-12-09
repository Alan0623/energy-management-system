    var goIndex = function () {
        location.href = "category.html";
    }

    var lat = 25.0857,
        lng = 121.5585,
        zoom = 12;
    var map = L.map('map', {
        zoomControl: false,
        minZoom: 10
    }).setView([lat, lng], zoom);
    // https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // custom zoom bar control that includes a Zoom Home function
    L.Control.zoomHome = L.Control.extend({
        options: {
            position: 'topright',
            zoomInText: '+',
            zoomInTitle: 'Zoom in',
            zoomOutText: '-',
            zoomOutTitle: 'Zoom out',
            zoomHomeText: '重置',
            zoomHomeTitle: 'Zoom home'
        },

        onAdd: function (map) {
            var controlName = 'gin-control-zoom',
                container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                options = this.options;

            this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
                controlName + '-in', container, this._zoomIn);
            this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
                controlName + '-home', container, this._zoomHome);
            this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
                controlName + '-out', container, this._zoomOut);

            this._updateDisabled();
            map.on('zoomend zoomlevelschange', this._updateDisabled, this);

            return container;
        },

        onRemove: function (map) {
            map.off('zoomend zoomlevelschange', this._updateDisabled, this);
        },

        _zoomIn: function (e) {
            this._map.zoomIn(e.shiftKey ? 3 : 1);
        },

        _zoomOut: function (e) {
            this._map.zoomOut(e.shiftKey ? 3 : 1);
        },

        _zoomHome: function (e) {
            map.setView([lat, lng], zoom);
        },

        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;

            L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);

            return link;
        },

        _updateDisabled: function () {
            var map = this._map,
                className = 'leaflet-disabled';

            L.DomUtil.removeClass(this._zoomInButton, className);
            L.DomUtil.removeClass(this._zoomOutButton, className);

            if (map._zoom === map.getMinZoom()) {
                L.DomUtil.addClass(this._zoomOutButton, className);
            }
            if (map._zoom === map.getMaxZoom()) {
                L.DomUtil.addClass(this._zoomInButton, className);
            }
        }
    });
    // add the new control to the map
    var zoomHome = new L.Control.zoomHome();
    zoomHome.addTo(map);


    var taipei = ['Beitou', 'Daan', 'Datong', 'Nangang',
        'Neihu', 'Shilin', 'Songshan', 'Wanhua',
        'Wenshan', 'Xinyi', 'Zhongshan', 'Zhongzheng'
    ];
    taipei.forEach(function (v, i) {
        $.getJSON('taipei/' + v + '.geojson', function (r) {
            L.geoJSON(r, {
                color: '#3a65ff'
            }).addTo(map);
        });
    });

    // 跳至指定marker
    var showMarker = function (tar) {
        map.fitBounds(
            [sites[tar].latlng], {
                maxZoom: 16
            }
        );
    }
    var sites = [
        // wenlin
        {
            name: "文林國小",
            ip: "10.10.10.100",
            latlng: [25.105870, 121.514220]
        },
        // zhongzheng
        {
            name: "中正高中",
            ip: "10.10.10.101",
            latlng: [25.107290, 121.519480]
        },
        // 
        {
            name: "軟橋公園",
            ip: "10.10.10.102",
            latlng: [25.103960, 121.517900]
        },
        {
            name: "洲美蜆仔港公園",
            ip: "10.10.10.103",
            latlng: [25.117460, 121.504250]
        },
        {
            name: "天文館",
            ip: "10.10.10.104",
            latlng: [25.095780, 121.518350]
        },
        {
            name: "寶橋分隊",
            ip: "10.10.10.105",
            latlng: [24.979290, 121.555290]
        },
        {
            name: "test",
            ip: "10.10.10.106",
            latlng: [24.977290, 121.555990]
        }
    ];

    var populate = function () {
        // 文林國小 台北市北投區文林北路155號
        var msg = "<strong>地標1</strong><br>文林國小。";
        addLeafLayer(sites[0], msg);
        // 中正高中 台北市北投區文林北路77號
        msg = "<strong>地標2</strong><br>中正高中。";
        addLeafLayer(sites[1], msg);
        // 公二 台北市北投區文林北路23巷18號
        msg = "<strong>地標3</strong><br>軟橋公園。";
        addLeafLayer(sites[2], msg);
        // 公五 台北市北投區台2乙線15號
        msg = "<strong>地標4</strong><br>洲美蜆仔港公園。";
        addLeafLayer(sites[3], msg);
        // 天文館 台北市士林區基河路363號
        msg = "<strong>地標5</strong><br>天文館。";
        addLeafLayer(sites[4], msg);
        // 寶橋分隊 台北市文山區樟新街2號
        msg = "<strong>地標6</strong><br>寶橋分隊。";
        addLeafLayer(sites[5], msg);

        // test
        msg = "<strong>地標7</strong><br>test。";
        addLeafLayer(sites[6], msg);
    }
    var markers = new L.MarkerClusterGroup();
    // 增加點位
    var addLeafLayer = function (site, msg) {
        var myIcon = L.icon({
            iconUrl: 'marker/green.png',
            iconSize: [38, 50]
        });
        var marker = new L.marker(site.latlng, {
            title: site.name,
            ip: site.ip,
            icon: myIcon
        });
        marker.on('mouseover', function (e) {
            this.bindPopup(spiderfy1(this)).openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        markers.addLayer(marker);
        map.addLayer(markers);
    }
    // markers.zoomToShowLayer(map, function() {
    //     map.__parent.spiderfy();
    //     map.openPopup();
    // })
    markers.on('clusterclick', function (a) {
        console.log('cluster', a.layer.getAllChildMarkers());
    });

    markers.on('click', function (a) {
        console.log('marker', a.layer);
    });

    // when zoom changed
    map.on('moveend', function () {
        bindGPopup();
    });
    var bindGPopup = function () {
        map.eachLayer(function (layer) {
            var m = layer;
            if (m._group && !m._events.mouseout) {
                m.on("mouseover", function () {
                    m.bindPopup(spiderfy2(m)).openPopup();
                });
                m.on("mouseout", function () {
                    m.closePopup();
                });
            }
        });
    }
    setTimeout(bindGPopup, 800);

    populate();
    var spiderfy1 = function (e) {
        console.log(e);
        return `
        <h2>Node <a class="node" href="element/node.jsp?node=21">${e.options.ip}</a></h2>
        <p><a target="_blank" href="topology?focusNodes=21">${e.options.title}</a></p>
        <p>Description: 
            <br>Maint.&nbsp;Contract: <br>IP Address: 10.10.10.1<br>Severity: 
            <a class="severity Normal" href="alarm/list.htm?sortby=id&amp;acktype=unack&amp;limit=20&amp;filter=node%3D21" target="_blank">Normal</a>
            <br>Categories: Smart City
        </p>
        `;
    }
    var spiderfy2 = function (m) {
        console.log(m);
        var tbody = ""
        for (var i = 0; i < m._childCount; i++) {
            tbody += `
            <tr class="node-marker-Normal">
                <td class="node-marker-label"><a class="node" href="element/node.jsp?node=37">SITE${i+1}</a></td>
                <td class="node-marker-ipaddress">10.10.10.${i+100}</td>
                <td class="node-marker-severity severity Normal">
                    <a style="color:black">Normal</a>
                </td>
            </tr>
            `
        }
        return `
            <h2 ># of nodes: ${m._childCount} (0 Unacknowledged Alarms)</h2>
            <table class="node-marker-list" style="width:100%">
                <tbody>

                    ${tbody}
                </tbody>
            </table>
        `;
    }