//
//  StreamingViewModel.m
//  LiveDemo
//
//  Created by 白璐 on 16/8/10.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "StreamingViewModel.h"
#import "StreamingModel.h"
#import "SettingViewModel.h"
#import <VideoCore/VideoCore.h>

@interface StreamingViewModel ()
@property(nonatomic, strong) StreamingModel* model;
@property(nonatomic, assign) BOOL automaticResume;
@property(nonatomic, assign) float zoomMax;
@property(nonatomic, assign) float zoomStep;
@property(nonatomic, assign) float scale;
@property(nonatomic, assign) float previousScale;
@end

@implementation StreamingViewModel

- (instancetype)initWithSettingViewModel:(SettingViewModel*)model {
    if (self = [super init]) {
        _model = [[StreamingModel alloc] init];
        _model.url = model.url;
        _model.resolution = model.resolution;
        _model.direction = model.direction;
        _automaticResume = NO;
        _zoomMax = 0.f;
        _scale = 1.0f;
    }
    
    return self;
}

- (CGSize)size {
    return [ResolutionHelper size:self.model.resolution direction:self.model.direction];
}

- (NSUInteger)bitrate {
    return [BitrateHelper bitrate:self.model.resolution];
}

- (void)setupSession:(AVCaptureVideoOrientation)orientation delegate:(id<VCSessionDelegate>)delegate {
    VCSimpleSessionConfiguration* configuration = [[VCSimpleSessionConfiguration alloc] init];
    configuration.cameraOrientation = orientation;
    configuration.videoSize = [self size];
    configuration.bitrate = [self bitrate];
    configuration.cameraDevice = VCCameraStateFront;
    configuration.continuousAutofocus = NO;
    configuration.continuousExposure = NO;
    
    self.model.session = [[VCSimpleSession alloc] initWithConfiguration:configuration];
    self.model.session.aspectMode = VCAspectModeFill;
    self.model.session.delegate = delegate;
}

- (void)onNotification:(NSNotification*)notification {
    if ([notification.name isEqualToString:UIApplicationWillResignActiveNotification]) {
        if (self.model.session.rtmpSessionState == VCSessionStateStarted) {
            self.automaticResume = YES;
            [self toggleStream];
        }
    }
    
    if ([notification.name isEqualToString:UIApplicationWillEnterForegroundNotification]) {
        if (self.automaticResume) {
            [self toggleStream];
            self.automaticResume = NO;
        }
    }
}

- (void)preview:(UIView *)view{
    if (self.model.session) {
        [view insertSubview:self.model.session.previewView atIndex:0];
    }
//        return self.model.session.previewView;
//    } else {
//        return nil;
//    }
}

- (void)updateFrame:(UIView*)view {
    
    self.model.session.previewView.frame =  CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    for (UIView* subview in self.model.session.previewView.subviews) {
//        subview.frame = view.bounds;
        subview.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    }
//    self.model.session.previewView.frame = [UIScreen mainScreen].bounds;
//    for (UIView* subview in self.model.session.previewView.subviews) {
//        subview.frame = [UIScreen mainScreen].bounds;
//    }
}

- (BOOL)back {
    if (self.model.session.rtmpSessionState == VCSessionStateStarting
        || self.model.session.rtmpSessionState == VCSessionStateStarted) {
        [self.model.session endRtmpSession];
        return YES;
    }
    
    return NO;
}

- (BOOL)toggleTorch {
    if (self.model.session) {
        self.model.session.torch = !self.model.session.torch;
    }
    
    return self.model.session.torch;
}

- (void)switchCamera {
    [self.model.session switchCamera];
    self.scale = 1.0f;
    self.zoomMax = 0.0f;
}

- (BOOL)toggleBeauty {
    if (self.model.session) {
        self.model.beautyEnabled = !self.model.beautyEnabled;
        [self.model.session enableBeautyEffect:self.model.beautyEnabled];
    }
    
    return self.model.beautyEnabled;
}

- (BOOL)toggleStream {
    
    switch(self.model.session.rtmpSessionState) {
        case VCSessionStateNone:
        case VCSessionStatePreviewStarted:
        case VCSessionStateEnded:
        case VCSessionStateError: {
            [self.model.session startRtmpSessionWithURL:self.model.url];
            return YES;
        }
        case VCSessionStateStarted: {
            [self.model.session endRtmpSession];
            return NO;
        }
        default:
            return NO;
    }
}

- (void)enableBeauty:(VCBeautyLevel)level {
    self.model.session.beautyLevel = level;
}

- (void)updateBright:(float)bright smooth:(float)smooth pink:(float)pink {
    [self.model.session setBeatyEffect:bright withSmooth:smooth withPink:pink];
}

- (void)initZoomMax {
    if (fabs(self.zoomMax) < 10e-6) {
        self.zoomMax = [self.model.session getMaxZoomLevel];
        self.zoomStep = (self.zoomMax - 1.0f) / 4;
    }
}

- (void)pinch:(CGFloat)scale state:(UIGestureRecognizerState)state {
    if (state == UIGestureRecognizerStateBegan) {
        [self initZoomMax];
        self.previousScale = self.scale;
    }
    
    CGFloat currentScale = fmaxf(fminf(self.scale * scale, self.zoomMax), 1.0f);
    CGSize size = self.model.session.videoSize;
    CGPoint center = CGPointMake(size.width / 2, size.height / 2);
    [self.model.session zoomVideo:currentScale withCenter:center];
    NSLog(@"the zoom level is %.2f", currentScale);
    
    self.previousScale = currentScale;
    if (state == UIGestureRecognizerStateEnded
        || state == UIGestureRecognizerStateCancelled
        || state == UIGestureRecognizerStateFailed) {
        self.scale = currentScale;
        NSLog(@"final scale: %f", self.scale);
    }
}

- (void)zoomIn {
    [self initZoomMax];
    
    if (fabs(self.scale - self.zoomMax) < 10e-6) {
        self.scale = 1.0f;
    } else {
        float scale = self.scale + self.zoomStep;
        scale = fmaxf(1, fminf(scale, self.zoomMax));
        self.scale = scale;
    }
    
    CGSize size = self.model.session.videoSize;
    CGPoint center = CGPointMake(size.width / 2, size.height / 2);
    [self.model.session zoomVideo:self.scale withCenter:center];
}

- (void)setInterestPoint:(CGPoint)point {
    self.model.session.focusPointOfInterest = point;
    self.model.session.exposurePointOfInterest = point;
}


@end
