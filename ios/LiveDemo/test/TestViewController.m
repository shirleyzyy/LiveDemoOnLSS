//
//  TestViewController.m
//  LiveDemo
//
//  Created by zhaoyuanyuan on 2017/6/29.
//  Copyright © 2017年 baidu. All rights reserved.
//

#import "TestViewController.h"
#import "TestView.h"
#import "Defines.h"
#import "SettingViewModel.h"
#import "StreamingViewModel.h"
#import <VideoCore/VideoCore.h>
@interface TestViewController ()<VCSessionDelegate>
@property(nonatomic, strong) StreamingViewModel* model;
@property (assign, nonatomic) BOOL isBacking;
@end

@implementation TestViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    TestView *t = [[TestView alloc] init];
    
    SettingViewModel *setVM = [[SettingViewModel alloc] init];
    setVM.url = @"";
    NSInteger s = 1;
    setVM.resolution = (Resolution)s;
    setVM.direction = (Direction)s;
    
    self.model = [[StreamingViewModel alloc] initWithSettingViewModel:setVM];
    
    [self.model setupSession:[self cameraOrientation] delegate:self];
    
//    self.test = [[ZYBackView alloc] init];
    t.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    NSLog(@"x:%f y:%f width:%f height:%f",t.frame.origin.x,t.frame.origin.y,t.frame.size.width,t.frame.size.height);
    NSLog(@"x:%f y:%f width:%f height:%f",self.view.frame.origin.x,self.view.frame.origin.y,self.view.frame.size.width,self.view.frame.size.height);
    
    [self.model preview:t];
    
    //    [self.model preview:self.view];
    [self.model updateFrame:t];
    
    
    self.view = t;
    // Do any additional setup after loading the view.
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
            //            [self.streamButton setBackgroundImage:[UIImage imageNamed:@"streaming"] forState:UIControlStateNormal];
            break;
        case VCSessionStateError:
            NSLog(@"Current state is VCSessionStateError\n");
            //            [self.streamButton setBackgroundImage:[UIImage imageNamed:@"stream_background"] forState:UIControlStateNormal];
            break;
        case VCSessionStateEnded:
            NSLog(@"Current state is VCSessionStateEnded\n");
            //            [self.streamButton setBackgroundImage:[UIImage imageNamed:@"stream_background"] forState:UIControlStateNormal];
            //            if (self.isBacking) {
            ////                [self.navigationController popViewControllerAnimated:YES];
            ////                self.isBacking = NO;
            //            }
            break;
        default:
            break;
    }
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
