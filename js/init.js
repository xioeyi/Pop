(function () {

    "use strict";


    var guge = new Cesium.UrlTemplateImageryProvider({
        url: 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        minimumLevel: 1,
        maximumLevel: 20
    });


    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMjM5OWRlZi1jMTZiLTRlNDQtYjE3OC03ZTFmMmMyOGU3ODEiLCJpZCI6MTkxOTEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzUxMjA4MDd9.VwZOjNxQ7uMJ5iM1lYRMplZvLWXHUQzdUo_maFjgtuI';
    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        baseLayerPicker: false,
        vrButton: true,
        geocoder: true,
        infoBox: true,
        sceneModePicker: false,
        timeline: false,
        imageryProvider: guge,

    });

    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.scene.debugShowFramesPerSecond = true; // Display FPS;

    //HomeButton
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        //你要飞的位置	
        viewer.camera.flyTo({
            //经纬度，高程
            // destination: Cesium.Cartesian3.fromDegrees(118.35, 35.05, 15000.0);
            //中国x: -3142554.528748818，y: 10219538.154816993，z: 8134694.527218356
            destination: new Cesium.Cartesian3(-2751201.607077297, 5045432.193487308, 4196281.121639684)
        });
    });

    //初始画面
    viewer.camera.setView({
        destination: new Cesium.Cartesian3(-2751201.607077297, 5045432.193487308, 4196281.121639684),
        orientation: {
            // 指向
            heading: 6.283185307179586,//Cesium.Math.toRadians(90, 0),
            // 视角
            pitch: -1.5707963267948966,//Cesium.Math.toRadians(-90),
            roll: 0.0,
        }

    })

    function addSheng() {
        let promise = Cesium.GeoJsonDataSource.load('../data/geojson/sheng.json');
        promise.then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            //alert("OK");
    
        }).otherwise(function(error) {
            window.alert(error);
        })
    }
    
    function addRiver() {
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../data/geojson/river.json'), {
            stroke : Cesium.Color.BLUE,
            strokeWidth : 3,
        });

    }
    
    function addRailway() {
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../data/geojson/railway.json'), {
            stroke : Cesium.Color.INDIGO,
            strokeWidth : 1.5,
        });
    }

    var setting = {
        check: {
            enable: true,
    
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: chooseNode,
        },
        view: {
    
        }
    };
    setting.check.chkboxType = {
        "Y": "s",
        "N": "s"
    };
    
    
    var zNodes = [{
        id: 1,
        pId: 0,
        name: "图层",
        open: true,
        checked: false
    },
    {
        id: 11,
        pId: 1,
        name: "矢量数据",
        open: true
    },
    {
        id: 111,
        pId: 11,
        name: "省界"
    },
    {
        id: 112,
        pId: 11,
        name: "河流"
    },
    {
        id: 113,
        pId: 11,
        name: "铁路"
    },
    {
        id: 12,
        pId: 1,
        name: "栅格数据",
        open: true
    },
    {
        id: 121,
        pId: 12,
        name: "卫星影像"
    },
    {
        id: 122,
        pId: 12,
        name: "数字高程模型",
        chkDisabled: true
    },
    {
        id: 13,
        pId: 1,
        name: "三维模型",
        isParent: true
    },
    {
        id: 131,
        pId: 13,
        name: "建筑物",
        chkDisabled: true
    },
    
    ];
    
    function chooseNode(event, treeId, treeNode) {
        if (treeNode.checked == true) {
            if (treeNode.id == 111) {
                return addSheng();
            }
            if (treeNode.id == 112) {
                return addRiver();
            }
            if (treeNode.id == 113) {
                return addRailway();
            }
        }
        if (treeNode.checked == false) {
            if (treeNode.id == 111) {
                return findAndRemove("sheng.json");
            }
            if (treeNode.id == 112) {
                return findAndRemove("river.json");
            }
            if (treeNode.id == 113) {
                return findAndRemove("railway.json");
            }
        }
    
    }
    
    
    
    function findAndRemove(name) {
        let dataSources = viewer.dataSources;
        for (let i = 0; i < viewer.dataSources.length; i++) {
            if (viewer.dataSources.get(i).name.indexOf(name) != -1) {
                viewer.dataSources.remove(viewer.dataSources.get(i));
                i--;
            }
        }
    }
    
    
    
    $(document).ready(function () {
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    });
})()

