//The following code loads the scene module and stores it in a variable so it can be used later to access objects within the scene.
const Animation = require('Animation');
const Scene = require('Scene');

//Add the code for loading the touchgestures module on the line below the scene module
const TouchGestures = require('TouchGestures');

//Add the following code to store the root in a variable and update the lines accessing objects
const sceneRoot = Scene.root;

//The following code finds the base_jnt object in the scene and stores it in a variable which we will use later to animate.
const base = Scene.root.find('base_jnt');

//code for accessing the speaker objects the line beneath the base object
const speakerLeft = Scene.root.find('speaker_left_jnt');
const speakerRight = Scene.root.find('speaker_right_jnt');

//Add the code for finding the plane tracker 
const planeTracker = sceneRoot.find('planeTracker0');

//Add the code for finding the placer
const placer = sceneRoot.find('placer');

//The following code creates a time driver using a set of parameters we create beforehand
const baseDriverParameters = {
    durationMilliseconds: 400,
    loopCount: Infinity,
    mirror: true
};

const baseDriver = Animation.timeDriver(baseDriverParameters);
baseDriver.start();

//The following code creates a sampler.
const baseSampler = Animation.samplers.easeInQuint(0.9,1);

//The animation is created by combining the driver and sampler.
const baseAnimation = Animation.animate(baseDriver,baseSampler);

//Getting the base transform
const baseTransform = base.transform;

//Binding the animation
baseTransform.scaleX = baseAnimation;
baseTransform.scaleY = baseAnimation;
baseTransform.scaleZ = baseAnimation;

//create a driver, sampler and animation for the speakers 
const speakerDriverParameters = {
    durationMilliseconds: 200,
    loopCount: Infinity,
    mirror: true
};

const speakerDriver = Animation.timeDriver(speakerDriverParameters);
speakerDriver.start();

//Sampler
const speakerSampler = Animation.samplers.easeOutElastic(0.7,0.85);

//Speaker Animation
const speakerAnimation = Animation.animate(speakerDriver,speakerSampler);
const speakerLeftTransform = speakerLeft.transform;

speakerLeftTransform.scaleX = speakerAnimation;
speakerLeftTransform.scaleY = speakerAnimation;
speakerLeftTransform.scaleZ = speakerAnimation;

const speakerRightTransform = speakerRight.transform;

speakerRightTransform.scaleX = speakerAnimation;
speakerRightTransform.scaleY = speakerAnimation;
speakerRightTransform.scaleZ = speakerAnimation;

//The following code subscribes to pan gestures
TouchGestures.onPan().subscribe(function(gesture) {
     planeTracker.trackPoint(gesture.location, gesture.state);
});

const placerTransform = placer.transform;

//Pinching the boombox
TouchGestures.onPinch().subscribeWithSnapshot( {
	'lastScaleX' : placerTransform.scaleX,
    'lastScaleY' : placerTransform.scaleY,
    'lastScaleZ' : placerTransform.scaleZ 
}, function (gesture, snapshot) {
	placerTransform.scaleX = gesture.scale.mul(snapshot.lastScaleX);
    placerTransform.scaleY = gesture.scale.mul(snapshot.lastScaleY);
    placerTransform.scaleZ = gesture.scale.mul(snapshot.lastScaleZ);
});

//Rotating the boombox
TouchGestures.onRotate().subscribeWithSnapshot( {
    'lastRotationY' : placerTransform.rotationY,
}, function (gesture, snapshot) {
    const correctRotation = gesture.rotation.mul(-1);
    placerTransform.rotationY = correctRotation.add(snapshot.lastRotationY);
});