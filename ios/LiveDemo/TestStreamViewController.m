//
//  TestStreamViewController.m
//  LiveDemo
//
//  Created by zhaoyuanyuan on 2017/8/4.
//  Copyright © 2017年 zhaoyuanyuan. All rights reserved.
//

#import "TestStreamViewController.h"
#import "Defines.h"
#import "SettingViewModel.h"
#import "StreamingViewModel.h"
#import <VideoCore/VideoCore.h>
@interface TestStreamViewController ()<VCSessionDelegate>
@property(nonatomic, strong) StreamingViewModel* model;
@end

@implementation TestStreamViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    SettingViewModel *setVM = [[SettingViewModel alloc] init];
    setVM.url = @"rtmp://push.bcelive.com/live/yvwslfyqf9lgyfnnsy";
    setVM.resolution =  Resolution_1080P;
    setVM.direction = DirectionPortrait;
    self.model = [[StreamingViewModel alloc] initWithSettingViewModel:setVM];
    
    [self.model setupSession:[self cameraOrientation] delegate:self];
    [self.model preview:self.view];
    
    //    [self.model preview:self.view];
    [self.model updateFrame:self.view];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.model toggleStream];
    });
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (AVCaptureVideoOrientation)cameraOrientation {
    return AVCaptureVideoOrientationPortrait;
}

#pragma mark - VCSessionDelegate
- (void) connectionStatusChanged: (VCSessionState) sessionState {
    switch(sessionState) {
        case VCSessionStatePreviewStarted:
            break;
        case VCSessionStateStarting:
            NSLog(@"Current state is VCSessionStateStarting\n");
            break;
        case VCSessionStateStarted:
            NSLog(@"Current state is VCSessionStateStarted\n");
            break;
        case VCSessionStateError:
            NSLog(@"Current state is VCSessionStateError\n");
            break;
        case VCSessionStateEnded:
            NSLog(@"Current state is VCSessionStateEnded\n");
            break;
        default:
            break;
    }
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
